const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
    status:{
        type: String,
        default: "active"
    },
    vehicle: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'Vehicle' 
        } 

    
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
