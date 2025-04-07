const express = require("express");
const router = express.Router();
const db = require("../db");

// Function to generate unique UID
const generateUID = (firstName = "N") => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits
    return firstName.charAt(0).toUpperCase() + randomDigits; // First letter + 5-digit number
};

// **CREATE Doctor (POST)**
router.post("/doctors", async (req, res) => {
    try {
        const {
            first_name, last_name, email, mobile, address, clinic, license_number, 
            aadhar_card, experience, degree, university, specialization, 
            availability, from_time, to_time, additional_info, password
        } = req.body;

        const uid = generateUID(first_name); // Generate UID

        const sql = `INSERT INTO doctors 
        (uid, first_name, last_name, email, mobile, address, clinic, license_number, aadhar_card, 
        experience, degree, university, specialization, availability, from_time, to_time, additional_info, password) 
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

        await db.query(sql, [uid, first_name, last_name, email, mobile, address, clinic, 
            license_number, aadhar_card, experience, degree, university, specialization, 
            availability, from_time, to_time, additional_info, password ]);

        res.status(201).json({ message: "Doctor registered successfully!", uid });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// **GET All Doctors**
router.get("/getdoctors", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM doctors");
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// **GET Doctor by UID**
router.get("/getdoctors/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const [rows] = await db.query("SELECT * FROM doctors WHERE uid = ?", [uid]);

        if (rows.length === 0) return res.status(404).json({ message: "Doctor not found!" });

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// **UPDATE Doctor by UID**
router.put("/updatedoctors/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const {
            first_name, last_name, email, mobile, address, clinic, license_number, 
            aadhar_card, experience, degree, university, specialization, 
            availability, from_time, to_time, additional_info
        } = req.body;

        const sql = `UPDATE doctors SET 
            first_name = ?, last_name = ?, email = ?, mobile = ?, address = ?, clinic = ?, 
            license_number = ?, aadhar_card = ?, experience = ?, degree = ?, university = ?, 
            specialization = ?, availability = ?, from_time = ?, to_time = ?, additional_info = ? 
            WHERE uid = ?`;

        const [result] = await db.query(sql, [
            first_name, last_name, email, mobile, address, clinic, license_number, 
            aadhar_card, experience, degree, university, specialization, 
            availability, from_time, to_time, additional_info, uid
        ]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Doctor not found!" });

        res.status(200).json({ message: "Doctor details updated successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// **DELETE Doctor by UID**
router.delete("/deletedoctors/:uid", async (req, res) => {
    try {
        const { uid } = req.params;

        const [result] = await db.query("DELETE FROM doctors WHERE uid = ?", [uid]);

        if (result.affectedRows === 0) return res.status(404).json({ message: "Doctor not found!" });

        res.status(200).json({ message: "Doctor deleted successfully!" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

module.exports = router;
