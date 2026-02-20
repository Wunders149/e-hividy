const express = require('express');
const router = express.Router();

// View cart
router.get('/', (req, res) => {
  // Get cart items
});

// Add item to cart
router.post('/add', (req, res) => {
  // Add item logic
});

// Remove item from cart
router.post('/remove/:id', (req, res) => {
  // Remove item logic
});

module.exports = router;
