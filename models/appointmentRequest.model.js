const mongoose = require("mongoose");

// Define a schema for appointment requests
const AppointmentRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    requestedDate: { type: Date, required: true },
    requestedTime: { type: String, required: true }, // Assuming time is stored as string
    appointmentType: { type: String, enum: ['basic', 'extra', 'gold', 'fluffy`s'], default: 'extra'}, // appointment type field
    status: { type: String, enum: ['pending', 'accepted', 'denied'], default: 'pending' } // Status field
    // Other fields related to the appointment request
});

const AppointmentRequest = mongoose.model('AppointmentRequest', AppointmentRequestSchema);

module.exports = AppointmentRequest;