const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
