
const express = require("express");
const router = express.Router();
const appoinmentController = require("../controllers/appoinmentController");


//appoinment count
router.get('/count',appoinmentController.getAppoinmentCount);



module.exports = router;
