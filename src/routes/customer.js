// routes/customerRoutes.js

const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");


// Get all customers
router.get("/customer", customerController.getAllCustomers);
//if not relevant this del this(created to test)
router.post("/customer", customerController.createCustomer);
//activate-deactivate customers
router.put('/customer/:customerId/toggle-status', customerController.toggleCustomerStatus);




module.exports = router;
