const mongoose = require("mongoose");
const moment = require('moment');

const Schema = mongoose.Schema;
function getCurrentFormattedDate() {
    return moment().format("MM/DD/yyyy");
}

const appointmentSchema = new Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    vehicleType:{
        type: String,
        required: true
    },
    vehicleModel:{
        type: String,
        required: true
    },
    mfYear:{
        type: String,
        required: true
    },
    vrNo:{
        type: String,
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
        type: String,
        required: true
    },
    createtime: {
        type:String,
        require:true,
        default: getCurrentFormattedDate
    },
    nextS_date: {
        type: Date,
        default: null
    },
    t_alertStatus:{
        type: String,
        required: true,
        default: "Pending"
    },
    status: {
        type: String,
        required: true,
        default: "Active"
    }
}

);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;