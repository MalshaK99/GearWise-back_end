
const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// Create a new Vehicle
router.post("/", vehicleController.createVehicle);


// Get a Vehicle by ID
router.get("/:id", vehicleController.getVehicleById);

// Update a Vehicle by ID
router.patch("/:id", vehicleController.updateVehicleById);

// Delete a Vehicle by ID
router.delete("/:id", vehicleController.deleteVehicleById);

module.exports = router;
