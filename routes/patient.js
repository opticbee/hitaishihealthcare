const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection

// POST route to add a new patient
router.post('/patients', (req, res) => {
    const { first_name, last_name, email, mobile, blood_group, gender, dob, disease, address, password, confirm_password } = req.body;
    
    if (!first_name || !last_name || !email || !mobile || !blood_group || !gender || !dob || !disease || !address || !password || !confirm_password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = 'INSERT INTO patients (first_name, last_name, email, mobile, blood_group, gender, dob, disease, address, password, confirm_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [first_name, last_name, email, mobile, blood_group, gender, dob, disease, address, password, confirm_password];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        res.status(201).json({ message: 'Patient added successfully', patientId: result.insertId });
    });
});

module.exports = router;
