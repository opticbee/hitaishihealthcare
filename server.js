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



app.use(cors());
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); 


// Use the testBooking routes
app.use("/api", testBookingRoutes);
app.use("/api", patientRoutes);
app.use("/api", patientLoginRoutes); 
app.use('/api', doctorRoutes); 


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
