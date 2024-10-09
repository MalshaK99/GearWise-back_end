// routes/customerRoutes.js

const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const isAuthenticated = require('../middleware/authMiddleware');
 
// Get all customers
router.get("/", customerController.getAllCustomers);
//get suppliers
router.get('/suppliers', customerController.fetchSuppliers);
// get customer
router.post('/logincustomer', customerController.fetchCustomer);

//activate-deactivate customers
router.put('/:customerId/toggle-status', customerController.toggleCustomerStatus);

//cus count
router.get('/count', customerController.getCustomerCount);

//ksk
router.post('/logout', customerController.logout);

// to get session 
router.get('/session',customerController.session);
//ksk

//hasa
//add customers userPrifile
router.post("/customers", customerController.addCustomer);

//signin
router.post("/signup", customerController.signupCustomer);

// Get all customer profiles
// router.get("/customerspro", customerController.getCustomerprofile);

//Get specific customer details from userProfile
//and for appointment details
router.get("/customerspro/:id", customerController.getOneCusprofile);

//Update user profile
router.put("/customerspro/:id", customerController.updateProfile);

// //ksk
// router.get('/customerspro', isAuthenticated, async (req, res) => {
//     try {
//       const customerId = req.session.customerId;
//       const customer = await customerService.getCustomerById(customerId);
      
//       if (!customer) {
//         return res.status(404).json({ message: "Customer not found" });
//       }
  
//       res.status(200).json({ status: true, customer });
//     } catch (error) {
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   });
//   //

module.exports = router;
