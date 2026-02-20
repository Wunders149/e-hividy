const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirm } = req.body;

    // Validation
    if (!name || !email || !password || !confirm) {
      return res.status(400).render('register', { message: 'Please fill all fields' });
    }

    if (password !== confirm) {
      return res.status(400).render('register', { message: 'Passwords do not match' });
    }

    const connection = await db.getConnection();
    
    // Check if email exists
    const [results] = await connection.query('SELECT email FROM users WHERE email = ?', [email]);
    
    if (results.length > 0) {
      connection.release();
      return res.status(400).render('register', { message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert user
    await connection.query('INSERT INTO users SET ?', { name, email, password: hashedPassword });
    connection.release();

    res.status(201).render('register', { message: 'User registered successfully! Please login.' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).render('register', { message: 'Error registering user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('login', { message: 'Please provide email and password' });
    }

    const connection = await db.getConnection();
    const [results] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

    if (results.length === 0) {
      return res.status(401).render('login', { message: 'Email or password incorrect' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, results[0].password);
    
    if (!passwordMatch) {
      return res.status(401).render('login', { message: 'Email or password incorrect' });
    }

    // Store user in session
    req.session.user = {
      id: results[0].id,
      name: results[0].name,
      email: results[0].email
    };

    res.status(200).redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', { message: 'Error logging in' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login-page');
  });
});

// Show login page
router.get('/login-page', (req, res) => {
  res.render('login', { message: '' });
});

// Show register page
router.get('/register-page', (req, res) => {
  res.render('register', { message: '' });
});

module.exports = router;
