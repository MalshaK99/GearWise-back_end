const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appoinmentController');

// Get appointments
router.get('/', appointmentController.getAppointmentsByDate);

// view appointment for relevant user
router.get('/viewappointment/:id', appointmentController.getappointment);

//add appoinments
router.post('/createappointment',appointmentController.createAppoinment);
module.exports = router;
