const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hours
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Database
const db = require('./config/db');

// Middleware to check if user is logged in
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
  } else {
    res.locals.user = null;
  }
  next();
});

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/checkout', require('./routes/checkout'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Test route
app.get('/test', (req, res) => {
  res.render('index', { products: [], user: null });
});

// Home page
app.get('/', async (req, res, next) => {
  try {
    const connection = await db.getConnection();
    const [products] = await connection.query('SELECT * FROM products LIMIT 12');
    connection.release();
    return res.render('index', { products, user: req.session.user || null });
  } catch (error) {
    console.error('Error in home route:', error.message, error.stack);
    try {
      return res.render('index', { products: [], user: req.session.user || null });
    } catch (renderError) {
      console.error('Render error:', renderError);
      return res.status(500).send('Error loading page');
    }
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).send('Internal server error');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
