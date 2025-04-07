// db.js
const mysql = require('mysql');

// Create a connection to the MySQL database
const db = mysql.createConnection({
    host: 'localhost',    // Database host
    user: 'root',         // MySQL user
    password: '2142',         // MySQL password (make sure to set this properly)
    database: 'testbooking_db' // Your MySQL database name
});

// Connect to the MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

module.exports = db;
