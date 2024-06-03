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
router.get('/count',customerController.getCustomerCount);



module.exports = router;
