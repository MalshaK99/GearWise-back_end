const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// Create a new Vehicle
router.post("/", vehicleController.createVehicle);

// Get all customers
router.get("/customers", vehicleController.getCustomers);

// Get a Vehicle by ID
router.get("/:id", vehicleController.getVehicleById);

// Update a Vehicle by ID
router.patch("/:vehicle_no", vehicleController.updateVehicleById);

// Delete a Vehicle by ID
router.delete("/:id", vehicleController.deleteVehicleById);

module.exports = router;
