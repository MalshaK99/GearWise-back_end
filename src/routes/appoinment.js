const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appoinmentController');

// Get appointments
router.get('/', appointmentController.getAppointmentsByDate);
router.get('/count', appointmentController.appoinmentCount);
router.get('/appointmentcount/:id',appointmentController.appoinmentCountforReward);

// view appointment for relevant user
router.get('/viewappointment/:id', appointmentController.getappointment);

//add appoinments
router.post('/createappointment',appointmentController.createAppoinment);

//cancel appointment
router.put('/cancelappointmnet/:id',appointmentController.updateAppointmentStatus);

//reshedule appointment
router.put('/resheduleappointmnet/:id',appointmentController.resheduleAppointment);

module.exports = router;
