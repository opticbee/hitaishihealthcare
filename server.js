// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const testBookingRoutes = require('./routes/testbooking');  // Import the test booking routes
const patientLoginRoutes = require("./routes/patientlogin"); // Import the patient login routes
const patientRoutes = require("./routes/patient");
const doctorRoutes = require("./routes/doctor"); // Import the doctor routes
const app = express();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });






// Serve clinic.html from custom folder
app.get("/clinic", (req, res) => {
    res.sendFile(path.join(__dirname,  "clinic.html"));
  });



  // Your existing API
app.post("/api/clinicregister", (req, res) => {
    // Handle form data here
    res.send({ message: "Clinic registered!" });
  });
  
  // Start the server
  app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
  });

app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 
const clinicRegister = require('./routes/clinicRegister');


app.use('/api', clinicRegister);
app.use("/api", testBookingRoutes);
app.use("/api", patientRoutes);
app.use("/api", patientLoginRoutes); 
app.use('/api', doctorRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
