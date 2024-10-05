const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: function() {
      return !this.googleId; // Required only if googleId is not present
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: function() {
      return !this.googleId; // Required only if googleId is not present
    },
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
    required: function() {
      return !this.googleId; // Required only if googleId is not present
    },
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
    unique: true,
    sparse: true, // Allows multiple null values
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving the document
CustomerSchema.pre("save", async function(next) {
  if (this.isModified("password") || this.isNew) {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
  next();
});

// Check if the model already exists to prevent overwriting
const Customer = mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
