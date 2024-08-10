const Customer = require("../models/customer"); // Adjust the path as needed
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class CustomerService {
  static async registerCustomer(name, email, phone, password) {
    try {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return { success: false, message: "Customer already exists" };
      }

      const newCustomer = new Customer({
        name,
        email,
        phone,
        password
      });

      await newCustomer.save();
      return { success: true, message: "Customer registered successfully" };
    } catch (error) {
      console.error("Error while registering customer:", error);
      throw new Error("Error while registering customer");
    }
  }

  static async checkCustomer(email) {
    try {
      const customer = await Customer.findOne({ email });
      return customer;
    } catch (error) {
      throw error;
    }
  }

  static async generateToken(data, secretKey, jwtExp) {
    try {
      return jwt.sign(data, secretKey, { expiresIn: jwtExp });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CustomerService;