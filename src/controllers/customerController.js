// controllers/customerController.js

const Customer = require("../models/customer");


// Get all cus
exports.getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find({});
        res.status(200).send(customers);
    } catch (error) {
        res.status(400).send(error);
    }
};

//add cus(just to test)
exports.createCustomer = async (req, res) => {
    console.log(req.body);
    const customers = new Customer(req.body);

    try {
        await customers.save();
        res.status(201).send(customers);
    } catch (error) {
        res.status(400).send(error);
    }
};
exports.toggleCustomerStatus = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Toggle status
        customer.status = customer.status === "active" ? "deactivated" : "active";
        await customer.save();

        res.status(200).json({ message: "Customer status updated successfully", customer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};