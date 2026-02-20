const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products
router.get('/', async (req, res) => {
  try {
    const connection = await db.getConnection();
    const [products] = await connection.query('SELECT * FROM products');
    connection.release();
    
    res.render('index', { products, user: req.session.user || null });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('index', { products: [], user: req.session.user || null });
  }
});

// Get product details
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    
    const connection = await db.getConnection();
    const [products] = await connection.query('SELECT * FROM products WHERE id = ?', [productId]);
    connection.release();

    if (products.length === 0) {
      return res.status(404).send('Product not found');
    }

    res.render('product', { product: products[0], user: req.session.user || null });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).send('Error fetching product');
  }
});

module.exports = router;
