
const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// Create a new Vehicle
router.post("/vehicle", vehicleController.createVehicle);


// Get a Vehicle by ID
router.get("/vehicle/:id", vehicleController.getVehicleById);

// Update a Vehicle by ID
router.patch("/vehicle/:id", vehicleController.updateVehicleById);

// Delete a Vehicle by ID
router.delete("/vehicle/:id", vehicleController.deleteVehicleById);

module.exports = router;
