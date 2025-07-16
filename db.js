// db.js
const mysql = require('mysql2');

// Create the connection pool
const db = mysql.createPool({
  host: '35.202.28.237',           // your VM public IP
  user: 'naveenteja',              // MySQL username
  password: '214122',              // MySQL password
  database: 'hitaishihealthcare',  // Your DB name
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Optional: Test the connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ DB connection error:', err);
    return;
  }
  if (connection) {
    console.log('✅ Database connected successfully (via pool)');
    connection.release();
  }
});

module.exports = db;
