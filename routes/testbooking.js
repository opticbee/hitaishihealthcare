// testbooking.js
const express = require('express');
const db = require('../db');  // Import the database connection
const router = express.Router();

// Test Booking API Route
router.post('/testbooking', (req, res) => {
    console.log("📥 Incoming Request Body:", req.body);  // ✅ Debugging

    const { testName, name, phone, email, floor, houseNumber, area, mandal, district, pincode } = req.body;

    if (!testName || !name || !phone || !email) {
        console.error('❌ Missing required fields');
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Query to insert the booking data into the database
    const query = `
        INSERT INTO bookings (test_name, name, phone, email, floor, house_number, area, mandal, district, pincode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [testName, name, phone, email, floor, houseNumber, area, mandal, district, pincode];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('❌ Database Error:', err.sqlMessage || err);
            return res.status(500).json({ message: 'Database error', error: err.sqlMessage || err });
        }

        console.log("✅ Booking Successful:", result);
        res.status(201).json({ message: 'Booking successful', bookingId: result.insertId });
    });
});

module.exports = router;
