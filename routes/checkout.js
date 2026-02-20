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
      SELECT c.product_id, c.quantity, p.name, p.price
      FROM cart c
      INNER JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);

    if (cartItems.length === 0) {
      connection.release();
      return res.redirect('/cart');
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
  try {
    const userId = req.session.user.id;
    const { address, city, state, zip } = req.body;

    // Validation
    if (!address || !city || !state || !zip) {
      const connection = await db.getConnection();
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

    const connection = await db.getConnection();

    // Get cart items
    const [cartItems] = await connection.query(`
      SELECT c.id, c.product_id, c.quantity, p.price
      FROM cart c
      INNER JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [userId]);

    if (cartItems.length === 0) {
      connection.release();
      return res.redirect('/cart');
    }

    // Calculate total
    let totalAmount = 0;
    cartItems.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    // Create order
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, totalAmount, 'completed']
    );

    const orderId = orderResult.insertId;

    // Add order items
    for (const item of cartItems) {
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await connection.query('DELETE FROM cart WHERE user_id = ?', [userId]);

    connection.release();

    res.render('checkout', {
      cartItems: [],
      total: 0,
      user: req.session.user,
      message: `Order placed successfully! Order ID: ${orderId}`
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).send('Error placing order');
  }
});

module.exports = router;
