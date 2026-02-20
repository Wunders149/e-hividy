const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware to check if user is logged in
const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login-page');
  }
  next();
};

// Checkout page
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const connection = await db.getConnection();

    // Get cart items
    const [cartItems] = await connection.query(`
      SELECT c.product_id, c.quantity, p.name, p.price, p.stock
      FROM cart c
      INNER JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);

    if (cartItems.length === 0) {
      connection.release();
      return res.redirect('/cart');
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.quantity > item.stock) {
        connection.release();
        return res.render('checkout', {
          cartItems: [],
          total: 0,
          user: req.session.user,
          message: `Sorry, ${item.name} is out of stock`
        });
      }
    }

    // Calculate total
    let total = 0;
    cartItems.forEach(item => {
      total += item.price * item.quantity;
    });

    connection.release();

    res.render('checkout', {
      cartItems,
      total,
      user: req.session.user,
      message: ''
    });
  } catch (error) {
    console.error('Error loading checkout:', error);
    res.status(500).send('Error loading checkout page');
  }
});

// Place order
router.post('/place-order', isAuthenticated, async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    const userId = req.session.user.id;
    const { address, city, state, zip } = req.body;

    // Validation
    if (!address || !city || !state || !zip) {
      const [cartItems] = await connection.query(`
        SELECT c.product_id, c.quantity, p.name, p.price
        FROM cart c
        INNER JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
      `, [userId]);

      let total = 0;
      cartItems.forEach(item => {
        total += item.price * item.quantity;
      });

      connection.release();

      return res.render('checkout', {
        cartItems,
        total,
        user: req.session.user,
        message: 'Please fill all fields'
      });
    }

    // Start transaction
    await connection.beginTransaction();

    try {
      // Get cart items with stock info (lock rows for update)
      const [cartItems] = await connection.query(`
        SELECT c.id as cart_id, c.product_id, c.quantity, p.price, p.stock
        FROM cart c
        INNER JOIN products p ON c.product_id = p.id
        WHERE c.user_id = ?
        FOR UPDATE
      `, [userId]);

      if (cartItems.length === 0) {
        await connection.rollback();
        connection.release();
        return res.redirect('/cart');
      }

      // Verify stock availability for all items
      for (const item of cartItems) {
        if (item.quantity > item.stock) {
          await connection.rollback();
          connection.release();
          return res.render('checkout', {
            cartItems: [],
            total: 0,
            user: req.session.user,
            message: `Sorry, some items are out of stock`
          });
        }
      }

      // Calculate total
      let totalAmount = 0;
      cartItems.forEach(item => {
        totalAmount += item.price * item.quantity;
      });

      // Create order
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_amount, status, address, city, state, zip) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, totalAmount, 'completed', address, city, state, zip]
      );

      const orderId = orderResult.insertId;

      // Add order items and update stock
      for (const item of cartItems) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Update product stock
        await connection.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Clear cart
      await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);

      // Commit transaction
      await connection.commit();
      connection.release();

      res.render('checkout', {
        cartItems: [],
        total: 0,
        user: req.session.user,
        message: `Order placed successfully! Order ID: ${orderId}`
      });
    } catch (transactionError) {
      // Rollback on error
      await connection.rollback();
      throw transactionError;
    }
  } catch (error) {
    console.error('Error placing order:', error);
    if (connection) {
      try {
        await connection.rollback();
        connection.release();
      } catch (e) {}
    }
    res.status(500).send('Error placing order');
  }
});

module.exports = router;
