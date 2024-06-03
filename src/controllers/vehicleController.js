const Vehicle = require("../models/vehicle");
const Customer = require('../models/customer');
const Product = require("../models/product");
const mongoose = require('mongoose');

// Create a new vehicle
exports.createVehicle = async (req, res) => {
    console.log(req.body);
    const { vehicle_no, v_type, s_type, s_date, owner } = req.body;

    try {
        // Fetch the customer details using the owner (customer ID)
        const customer = await Customer.findById(owner);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Create a new vehicle entry
        const vehicle = new Vehicle({
            vehicle_no,
            v_type,
            s_type,
            s_date,
            cus_name: customer.name, // Include customer's name
            owner
        });

        await vehicle.save();
        res.status(201).send(vehicle);
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(400).send(error);
    }
};

// Fetch customer list
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).send(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send(error);
    }
};

// Get a Vehicle by ID
exports.getVehicleById = async (req, res) => {
    const _id = req.params.id;

    try {
        const vehicle = await Vehicle.findById(_id);
        if (!vehicle) {
            return res.status(404).send();
        }
        res.status(200).send(vehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};


exports.updateVehicleById = async (req, res) => {
    const { vehicle_no } = req.params;
    const { nextS_date, replacedParts } = req.body;

    try {
        const updatedFields = {};
        
        if (nextS_date) {
            updatedFields.nextS_date = nextS_date;
        }

        if (replacedParts) {
            updatedFields.replacedParts = replacedParts;

            // Update the quantities of the replaced products
            for (const part of replacedParts) {
                const product = await Product.findById(part.productId);
                if (product) {
                    // Check if the new quantity will be >= 0
                    const newQuantity = product.quantity - part.quantity;
                    if (newQuantity < 0) {
                        return res.status(400).send({ message: `Quantity cannot be less than 0 for product ${product.name}` });
                    }
                    // Update only the quantity
                    await Product.findByIdAndUpdate(part.productId, { $set: { quantity: newQuantity } });
                } else {
                    return res.status(404).send({ message: `Product with id ${part.productId} not found` });
                }
            }
        }

        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { vehicle_no:vehicle_no},
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedVehicle) {
            return res.status(404).send({ message: 'Vehicle not found' });
        }

        res.status(200).send(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle fields:', error);
        res.status(400).send(error);
    }
};

// Delete a vehicle by ID
exports.deleteVehicleById = async (req, res) => {
    const _id = req.params.id;

    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(_id);
        if (!deletedVehicle) {
            return res.status(404).send();
        }
        res.status(200).send(deletedVehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};
