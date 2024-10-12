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
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to hash the password if it exists
CustomerSchema.pre("save", async function (next) {
  if (this.password && (this.isModified("password") || this.isNew)) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Method to compare passwords
CustomerSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    if (!this.password) {
      throw new Error("Password not set for Google-authenticated user.");
    }
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw new Error("Error comparing password: " + error.message);
  }
};

// Check if the model already exists to prevent overwriting
const Customer =
  mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
