const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// Create a new Vehicle
router.post("/", vehicleController.createVehicle);
//fetch all vehicles
router.get("/",vehicleController.getAllVehicles);
// Get all customers
router.get("/customers", vehicleController.getCustomers);

// Get a Vehicle by ID
// router.get("/:id", vehicleController.getVehicleById);

// Update a Vehicle by ID
router.patch("/:vehicle_no", vehicleController.updateVehicleById);

// Delete a Vehicle by ID
router.delete("/:id", vehicleController.deleteVehicleById);

//Add vehicle history
router.post("/history", vehicleController.addHistory);

//get vehicle history(specific)
router.get("/history/:vrNo", vehicleController.getHistory);

//Add vehicle and used products
// router.post('/add-vehicle', vehicleController.addVehicleWithProducts);

// //get vehicle details and the product details with parts to history
// router.get('/add-vehicle/:id', vehicleController.getVehicleWithParts);

module.exports = router;
