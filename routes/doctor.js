const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const upload = multer(); // for handling form data without files




// Function to generate unique UID
router.post("/doctors", upload.none(), async (req, res) => {
    const {
        first_name, last_name, email, mobile, address, clinic, license_number,
        aadhar_card, experience, degree, university, specialization,
        availability, from_time, to_time, additional_info, password
    } = req.body;

    const crypto = require("crypto");
    const uid = crypto.randomBytes(3).toString("hex"); // 3 bytes = 6 hex characters
        

    const sql = `INSERT INTO doctors 
        (uid, first_name, last_name, email, mobile, address, clinic, license_number, aadhar_card,
        experience, degree, university, specialization, availability, from_time, to_time, additional_info, password) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        uid, first_name, last_name, email, mobile, address, clinic, license_number, aadhar_card,
        experience, degree, university, specialization, availability, from_time, to_time, additional_info, password
    ];

    db.query("SELECT * FROM doctors WHERE aadhar_card = ?", [aadhar_card], (err, results) => {
        if (err) return res.status(500).json({ message: "Error checking Aadhar." });
    
        if (results.length > 0) {
            return res.status(400).json({ message: "Aadhar already registered." });
        }
    
        // Proceed to insert...
    });
    

    db.query(sql, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "Aadhar card already exists. Please use a different one." });
            }
            console.error(err);
            return res.status(500).json({ message: "Internal server error." });
        }

        res.status(201).json({ message: "Doctor registered successfully", uid: uid });
    });
});

// doctorlogin route (login API)
router.post("/doctorlogin", async (req, res) => {
    const { email, password } = req.body;
  
    const sql = "SELECT * FROM doctors WHERE email = ?";
    db.query(sql, [email], (err, results) => {
      if (err) return res.status(500).json({ message: "Database error!" });
  
      if (results.length === 0) {
        return res.status(404).json({ message: "Doctor not found!" });
      }
  
      const doctor = results[0];
  
      if (doctor.password !== password) {
        return res.status(401).json({ message: "Invalid credentials!" });
      }
  
      // Optionally generate a JWT or session here
      res.status(200).json({
        message: "Login successful",
        uid: doctor.uid,
        doctor: {
          name: doctor.first_name + " " + doctor.last_name,
          email: doctor.email,
          specialization: doctor.specialization
        }
      });
    });
  });
  


// **GET All Doctors**
router.get("/getdoctors", async (req, res) => {
    try {
        db.query("SELECT * FROM doctors", (err, rows) => {
            if (err) {
                console.error("Error:", err);
                return res.status(500).json({ message: "Server error!" });
            }
            res.status(200).json(rows);
        });
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server error!" });
    }
});

// **GET Doctor by UID**
router.get("/gdoctors/:uid", async (req, res) => {
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
