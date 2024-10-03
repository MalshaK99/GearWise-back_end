const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: true,
  },
  profilePhoto: {
    type: String,
    default: "2.jpg",
  },
  status: {
    type: String,
    default: "active",
  },
  role: {
    type: String,
    default: "customer",
  },    
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
  },
  googleId: {
    type: String,
  },
});

const Customer = mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
