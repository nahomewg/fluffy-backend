const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//environement variables
require("dotenv").config();

const connectionString = process.env.ATLAS_URI || "";
const AppointmentRequest = require("./models/appointmentRequest.model.js");

const app = express();
const PORT = 3000;


app.use(express.json(), cors());

app.get("/", (req, res) => {
    res.status(200);
    res.send("This is from root");
});

/**
 * Connect to the database and listen for the locahost:3000 port. Try/catch for error handling.
 * @param {any}
 * @returns {any}
 */
mongoose.connect(connectionString)
.then(() => {
    console.log("Connected to database!");
    })
    .catch(() => {
        console.log("connection string is: " + connectionString);
        console.log("Connection failed!");
    });


app.get("/api/appointmentRequest", async (req, res) => {
    try {
        const appointments = await AppointmentRequest.find({});
        res.status(200).json(appointments);
    } catch(error) {
        res.status(500).json({message: error.message});
    }
})

app.post("/api/appointmentRequest", async (req, res) => {
    try {
        const appointment = await AppointmentRequest.create(req.body);
        res.status(200).json(appointment);
    } catch(error) {
        res.status(500).json({message: error.message})
    }
});

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is successfully running on PORT ${PORT}`);
    } else {
        console.log("Error occurred. Server can't start", error);
    }
});