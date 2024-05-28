// controllers/productController.js

const Vehicle = require("../models/vehicle");

// Create a new product
exports.createVehicle = async (req, res) => {
    console.log(req.body);
    const vehicle = new Vehicle(req.body);

    try {
        await vehicle.save();
        res.status(201).send(vehicle);
    } catch (error) {
        res.status(400).send(error);
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

// Update a vehicle by ID
exports.updateVehicleById = async (req, res) => {
    const _id = req.params.id;

    try {
        const updatedVehicle = await Vehicle.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updatedVehicle) {
            return res.status(404).send();
        }
        res.status(200).send(updatedVehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a product by ID
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
