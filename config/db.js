const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then((conn) => {
    console.log('MySQL connected!');
    conn.release();
  })
  .catch((err) => {
    console.error('MySQL connection error:', err.message);
    console.log('Make sure XAMPP MySQL is running on localhost:3306');
  });

module.exports = pool;
