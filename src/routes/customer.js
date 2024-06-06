// routes/customerRoutes.js

const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");


// Get all customers
router.get("/", customerController.getAllCustomers);

//if not relevant this del this(created to test)
router.post("/customerreg", customerController.createCustomer);

//activate-deactivate customers
router.put('/:customerId/toggle-status', customerController.toggleCustomerStatus);

//cus count
router.get('/count', customerController.getCustomerCount);

//add customers userPrifile
router.post("/customers", customerController.addCustomer);

// Get all customer profiles
// router.get("/customerspro", customerController.getCustomerprofile);

//Get specific customer details from userProfile
//and for appointment details
router.get("/customerspro/:id", customerController.getOneCusprofile);

//Update user profile
router.put("/customerspro/:id", customerController.updateProfile);

module.exports = router;
