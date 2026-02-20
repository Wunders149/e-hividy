const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'shop'
});

connection.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.code);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => connection.connect(), 5000);
  } else {
    console.log('MySQL connected!');
  }
});

connection.on('error', (err) => {
  console.error('MySQL error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    connection.connect();
  }
});

module.exports = connection;
