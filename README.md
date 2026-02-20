# E-Hividy E-Commerce Shop

A complete e-commerce web application built with Node.js, Express.js, and MySQL.

## Features

- **User Authentication**: Register and Login with password encryption
- **Product Catalog**: Browse products with detailed information
- **Shopping Cart**: Add/remove items from cart
- **Checkout**: Complete order placement with shipping information
- **Order Management**: View order history (extensible)
- **Responsive Design**: Works on desktop and mobile devices
- **Session Management**: Secure user sessions

## Prerequisites

- Node.js (v12 or higher)
- XAMPP with MySQL running
- npm (comes with Node.js)

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd c:\xampp\htdocs\e-hividy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup the database**
   - Make sure MySQL is running in XAMPP
   - Run the database setup script:
   ```bash
   npm run setup
   ```
   This will create the database and tables automatically.

4. **Start the server**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and go to: `http://localhost:3000`

## Project Structure

```
e-hividy/
├── server.js              # Main application file
├── package.json           # Project dependencies
├── db-setup.js            # Database initialization script
├── config/
│   └── db.js              # Database connection configuration
├── routes/
│   ├── auth.js            # Authentication routes (login, register)
│   ├── products.js        # Product routes
│   ├── cart.js            # Shopping cart routes
│   └── checkout.js        # Checkout and order routes
├── views/
│   ├── index.ejs          # Home page with product listing
│   ├── login.ejs          # Login page
│   ├── register.ejs       # Registration page
│   ├── product.ejs        # Product details page
│   ├── cart.ejs           # Shopping cart page
│   └── checkout.ejs       # Checkout page
└── public/
    └── style.css          # Application styles
```

## Database Schema

### Tables

1. **users** - User registration and authentication
   - id, name, email, password, created_at

2. **products** - Product catalog
   - id, name, description, price, image, stock, created_at

3. **cart** - Shopping cart items
   - id, user_id, product_id, quantity, created_at

4. **orders** - Order records
   - id, user_id, total_amount, status, created_at

5. **order_items** - Items in each order
   - id, order_id, product_id, quantity, price

## Usage

### Register a New Account
1. Click "Register" link
2. Fill in name, email, password, and confirm password
3. Click "Register"

### Login
1. Click "Login" link
2. Enter email and password
3. Click "Login"

### Browse Products
- Home page displays all available products
- Click "View Details" to see product information

### Add to Cart
1. Click on a product
2. Select quantity
3. Click "Add to Cart"

### Checkout
1. Go to Shopping Cart
2. Review cart items
3. Click "Proceed to Checkout"
4. Enter shipping information
5. Click "Place Order"

## Security Features

- Password hashing with bcryptjs
- Session-based authentication
- Protected routes that require login
- SQL injection prevention (using prepared statements)
- XSS protection through EJS templating

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user
- `GET /auth/login-page` - Show login form
- `GET /auth/register-page` - Show registration form

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product details

### Cart
- `GET /cart` - View cart (requires login)
- `POST /cart/add` - Add item to cart (requires login)
- `POST /cart/remove/:id` - Remove item from cart (requires login)

### Checkout
- `GET /checkout` - Display checkout form (requires login)
- `POST /checkout/place-order` - Place an order (requires login)

## Sample Products

The database setup includes 12 sample products:
- Laptop, Smartphone, Tablet
- Headphones, Camera, Monitor
- Keyboard, Mouse, Webcam
- Speaker, Charger, Cable

## Configuration

### Database Connection (config/db.js)
```javascript
{
  host: 'localhost',        // MySQL host
  user: 'root',             // MySQL username
  password: '',             // MySQL password
  database: 'shop',         // Database name
  connectionLimit: 10       // Max concurrent connections
}
```

### Session Settings (server.js)
- Session timeout: 24 hours
- Secret key: 'your-secret-key' (change in production)

## Troubleshooting

### MySQL Connection Error
- Ensure XAMPP MySQL is running
- Check database credentials in `config/db.js`
- Database 'shop' must exist (created by db-setup.js)

### Port Already in Use
- Default port is 3000
- Change in server.js: `const PORT = process.env.PORT || 3000;`

### Missing Dependencies
- Run `npm install` again
- Delete node_modules folder and reinstall if issues persist

## Future Enhancements

- Payment gateway integration
- Email notifications
- Order history/tracking
- Product reviews and ratings
- Admin panel for product management
- Search and filtering
- User profile management
- Inventory management
- Analytics dashboard

## License

ISC

## Support

For issues or questions, please check the application logs or create an issue in your project management system.
