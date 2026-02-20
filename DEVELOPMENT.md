# Development Workflow Guide

## Local Development Setup

### Initial Setup (One Time)
```bash
npm install
npm run setup
```

### Daily Development
```bash
npm run dev
```

---

## Making Changes

### Adding a New Feature

1. **Plan the changes**
   - Database schema modifications needed?
   - New routes required?
   - New views needed?

2. **Update database** (if needed)
   - Modify `db-setup.js` to add new tables/columns
   - Run: `npm run setup` to apply changes

3. **Create/update routes** 
   - Edit files in `routes/` folder
   - Add proper error handling
   - Use prepared statements for queries

4. **Create/update views**
   - Create `.ejs` files in `views/` folder
   - Include navigation header
   - Test with sample data

5. **Update styles** (if needed)
   - Edit `public/style.css`
   - Test in different screen sizes

6. **Test thoroughly**
   - Test in browser at http://localhost:3000
   - Check console for errors
   - Verify database interactions

---

## Common Development Tasks

### Add a New Product Field

1. **Update database schema:**
   ```javascript
   // In db-setup.js, modify products table
   await connection.query(`
     CREATE TABLE IF NOT EXISTS products (
       id INT PRIMARY KEY AUTO_INCREMENT,
       name VARCHAR(100) NOT NULL,
       description TEXT NOT NULL,
       price DECIMAL(10, 2) NOT NULL,
       image VARCHAR(255),
       stock INT DEFAULT 0,
       category VARCHAR(50),  // NEW FIELD
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     )
   `);
   ```

2. **Update product routes:**
   ```javascript
   // In routes/products.js
   // Queries automatically include new field
   ```

3. **Update views:**
   ```javascript
   <!-- In views/index.ejs or product.ejs -->
   <p><%= product.category %></p>
   ```

4. **Test:**
   ```bash
   npm run setup    # Reset database with new schema
   npm run dev      # Test changes
   ```

---

### Add a New Route

1. **Create route file** or edit existing `routes/*.js`

2. **Implement handlers:**
   ```javascript
   router.get('/new-route', async (req, res) => {
     try {
       // Your logic here
       res.render('view-name', { data });
     } catch (error) {
       console.error('Error:', error);
       res.status(500).send('Error');
     }
   });
   ```

3. **Register in `server.js`:**
   ```javascript
   app.use('/route-prefix', require('./routes/route-file'));
   ```

4. **Create corresponding view** in `views/` if needed

5. **Test the new route**

---

### Update Styling

1. **Edit `public/style.css`**
   ```css
   .new-class {
     /* Your styles */
   }
   ```

2. **In your view, use the class:**
   ```html
   <div class="new-class">Content</div>
   ```

3. **Refresh browser** (Ctrl+R or Cmd+R)
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

## Testing Workflow

### Manual Testing Checklist
- [ ] Load homepage
- [ ] Register new user
- [ ] Login with new user
- [ ] Browse products
- [ ] View product details
- [ ] Add items to cart
- [ ] Edit cart quantities
- [ ] Remove from cart
- [ ] Proceed to checkout
- [ ] Enter shipping info
- [ ] Complete order
- [ ] Logout
- [ ] Login again

### Browser Console Testing
```javascript
// Test API endpoints directly
fetch('/products')
  .then(r => r.json())
  .then(d => console.log(d))

fetch('/cart/add', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({productId: 1, quantity: 1})
}).then(r => r.json()).then(console.log)
```

---

## Code Standards

### Variable Naming
```javascript
// Good
const userId = req.session.user.id;
const cartItems = [];
const totalPrice = calculateTotal();

// Avoid
const uid = req.session.user.id;
const items = [];
const tp = calculateTotal();
```

### Database Queries
```javascript
// Always use prepared statements
const [results] = await connection.query(
  'SELECT * FROM users WHERE email = ?',
  [email]
);

// Never concatenate user input
// ❌ BAD: 'SELECT * FROM users WHERE email = ' + email
```

### Error Handling
```javascript
// Good
try {
  // Your code
} catch (error) {
  console.error('Error description:', error);
  res.status(500).send('Error message');
}
```

### Comments
```javascript
// Good - explains WHY, not WHAT
// Check if product stock is sufficient before adding to cart
if (product.stock < quantity) {
  return res.status(400).json({ error: 'Insufficient stock' });
}

// Avoid - obvious
// Set price to 10
price = 10;
```

---

## Debugging Tips

### Check Server Logs
Watch terminal for console.log() output
```javascript
console.error('Error:', error);
console.log('User:', req.session.user);
```

### Browser DevTools (F12)
- **Console tab**: JavaScript errors
- **Network tab**: API requests/responses
- **Application**: Cookies and session data

### Test Database Directly
```bash
# Connect to MySQL
mysql -u root -p shop

# View tables
SHOW TABLES;

# Check data
SELECT * FROM products;
SELECT * FROM users;
```

### Enable More Logging
Add logging to key points:
```javascript
console.log('DEBUG: About to fetch products');
const products = await fetchProducts();
console.log('DEBUG: Fetched products:', products);
```

---

## Performance Optimization

### Current Optimizations in Place
- Database connection pooling
- Prepared statements (prevent SQL injection)
- Session middleware (reduced database queries)
- Static file caching

### Future Optimizations
- Add caching for product list
- Implement pagination
- Optimize database indexes
- Enable gzip compression
- Minimize CSS/JavaScript

---

## Deployment Preparation

Before deploying to production:

1. **Security**
   - Change SESSION_SECRET in server.js
   - Use environment variables
   - Remove console.log() debug statements
   - Set NODE_ENV=production

2. **Database**
   - Update database credentials
   - Create database backups
   - Test migration to production database

3. **Testing**
   - Run full test suite
   - Test all user flows
   - Check error handling
   - Verify security

4. **Performance**
   - Monitor response times
   - Check database query times
   - Set up error logging

---

## Version Control (Git)

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Description of changes"

# Push to remote
git push origin main
```

---

## Resources

- **Express.js**: https://expressjs.com/
- **EJS**: https://ejs.co/
- **MySQL2**: https://github.com/sidorares/node-mysql2
- **bcryptjs**: https://github.com/dcodeIO/bcrypt.js
- **Express-session**: https://github.com/expressjs/session

---

**Need help? Check README.md or QUICK_REFERENCE.md**
