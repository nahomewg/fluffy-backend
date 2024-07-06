const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mg = require("nodemailer-mailgun-transport");

//environement variables
require("dotenv").config();

// mongoose connection string and appointmentRequest model
const connectionString = process.env.ATLAS_URI || "";
const AppointmentRequest = require("./models/appointmentRequest.model.js");

// nodemailer mailgun
const auth = {
    auth: {
        api_key: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN
    }
};

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

const app = express();
const route = express.Router();
const PORT = process.env.PORT || 5000;

app.use(express.json(), cors());
app.use(express.urlencoded({ extended: false }));
app.use('/api', route);

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

app.post("/api/appointmentRequest", createAppointment, sendEmail);

async function createAppointment(req, res, next) {
    try {
        const appointment = await AppointmentRequest.create(req.body);
        res.status(200).json(appointment);
        req.appointment = appointment;
        next();
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

async function sendEmail(req, res) {
    try {
        const appointment = req.appointment;
        const newTime = convertTime(appointment.requestedTime);
        nodemailerMailgun.sendMail({
            from: process.env.MAILGUN_EMAIL,
            to: process.env.CLIENT_EMAIL,
            subject: "FLUFFY AUTO DETAILING Appointment Request",
            html: `
                <h3>Hello Fluffy, you have a new appointment request:</h3>
                <p>Name: ${appointment.name}</p>
                <p>Email: ${appointment.email}</p>
                <p>Phone Number: ${appointment.phoneNumber}</p>
                <p>Date: ${appointment.requestedDate.toISOString().split('T')[0]}</p>
                <p>Time: ${newTime}</p>
            `
        }, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log(`Response: ${info.response}`);
            }
        })
    } catch(error) {
        res.status(500).json({message: error.message})
    }
}

convertTime = (time) => {
    const timeString12hr = new Date('1970-01-01T' + time + 'Z').toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: true, hour: 'numeric', minute: 'numeric' });
    return timeString12hr;
}

app.listen(PORT, (error) => {
    if (!error) {
        console.log(`Server is successfully running on PORT ${PORT}`);
    } else {
        console.log("Error occurred. Server can't start", error);
    }
});