const Customer = require("../models/customer"); // Adjust the path as needed
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class CustomerService {
  static async registerCustomer(name, email, phone, password, gender, address) {
    try {
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return { success: false, message: "Customer already exists" };
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const newCustomer = new Customer({
        name,
        email,
        phone,
        gender,
        address,
        password: hashedPassword
      });

      await newCustomer.save();
      return { success: true, message: "Customer registered successfully" };
    } catch (error) {
      console.error("Error while registering customer:", error);
      throw new Error("Error while registering customer");
    }
  }
}

module.exports = CustomerService;
