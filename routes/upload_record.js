// routes/api.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage: storage });

// Create MySQL table if not exists
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aadhaar VARCHAR(12),
    mobile VARCHAR(10),
    email VARCHAR(255),
    description TEXT,
    filename VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;
db.query(createTableQuery, (err) => {
  if (err) console.error("Error creating table:", err);
  else console.log("Table 'records' ready.");
});

// POST /api/upload_record
router.post('/upload_record', upload.single('file'), (req, res) => {
  const { aadhaar, mobile, email, description } = req.body;
  const filename = req.file ? req.file.filename : null;

  if (!aadhaar || !mobile || !email || !description || !filename) {
    return res.status(400).send("All fields are required.");
  }

  const insertQuery = `INSERT INTO records (aadhaar, mobile, email, description, filename) VALUES (?, ?, ?, ?, ?)`;
  db.query(insertQuery, [aadhaar, mobile, email, description, filename], (err, result) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).send("Failed to save record.");
    }
    res.send("Record uploaded successfully.");
  });
});

module.exports = router;
