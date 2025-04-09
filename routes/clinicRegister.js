const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db"); // adjust the path if needed

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Route: POST /api/clinicregister
router.post("/clinicregister",
  upload.fields([
    { name: "licenseUpload", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "clinicPhoto", maxCount: 1 },
  ]),
  (req, res) => {
    const {
      clinicName,
      clinicType,
      registrationNumber,
      establishedYear,
      address1,
      address2,
      city,
      state,
      country,
      pincode,
      mapLink,
      phone1,
      phone2,
      email,
      website,
      contactPerson,
      designation,
      contactEmail,
      contactMobile,
      timings,
      emergency,
      gst,
      username,
      password,
      confirmPassword,
    } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const licensePath = req.files?.licenseUpload?.[0]?.path || null;
    const idProofPath = req.files?.idProof?.[0]?.path || null;
    const clinicPhotoPath = req.files?.clinicPhoto?.[0]?.path || null;

    const sql = `
      INSERT INTO clinics (
        clinicName, clinicType, registrationNumber, establishedYear,
        address1, address2, city, state, country, pincode, mapLink,
        phone1, phone2, email, website, contactPerson, designation,
        contactEmail, contactMobile, timings, emergency,
        licensePath, idProofPath, clinicPhotoPath, gst,
        username, password
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      clinicName, clinicType, registrationNumber, establishedYear,
      address1, address2, city, state, country, pincode, mapLink,
      phone1, phone2, email, website, contactPerson, designation,
      contactEmail, contactMobile, timings, emergency,
      licensePath, idProofPath, clinicPhotoPath, gst,
      username, password,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("MySQL Error:", err);
        return res.status(500).json({ message: "Database error" });
      }
      res.status(200).json({ message: "Clinic registered successfully!" });
    });
  }
);

module.exports = router;
