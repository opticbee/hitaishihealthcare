const express = require("express");
const router = express.Router();
const dbAppointments = require("../db");
const db = require("../db");

// Create the appointments table with updated column names
const createAppointmentsTable = `
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor VARCHAR(255),
  specialization VARCHAR(255),
  fee VARCHAR(20),
  patient_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  appointment_date DATE,
  time_slot VARCHAR(50),
  concern TEXT
)
`;

dbAppointments.query(createAppointmentsTable, (err) => {
  if (err) {
    console.error("❌ Failed to create appointments table:", err);
  } else {
    console.log("✅ appointments table is ready.");
  }
});

// POST route to insert appointment
router.post("/appointments", (req, res) => {
  const {
    doctor,
    specialization,
    fee,
    patient_name,
    email,
    phone,
    appointment_date,
    time_slot,
    concern
  } = req.body;

  const insertQuery = `
    INSERT INTO appointments (
      doctor,
      specialization,
      fee,
      patient_name,
      email,
      phone,
      appointment_date,
      time_slot,
      concern
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  dbAppointments.query(
    insertQuery,
    [
      doctor,
      specialization,
      fee,
      patient_name,
      email,
      phone,
      appointment_date,
      time_slot,
      concern
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error inserting appointment:", err);
        res.status(500).json({ error: "Database error while booking appointment" });
      } else {
        res.status(200).json({ message: "Appointment booked successfully", id: result.insertId });
      }
    }
  );
});

module.exports = router;
