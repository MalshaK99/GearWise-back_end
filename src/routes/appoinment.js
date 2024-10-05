const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appoinmentController');
  

// update next service date
router.patch('/:vehicle_no', appointmentController.updateNextServiceDate);

//alert using next service date
router.get('/next_sdate',appointmentController.getAppointmentsByN_SDate);
//update next service date alert status
router.put('/alertStatus',appointmentController.alertStatus);
// Get appointments
router.get('/', appointmentController.getAppointmentsByDate);

router.get('/count', appointmentController.appoinmentCount);
// for analysis
router.get('/countforanalysis', appointmentController.appoinmentCountforanalysis);

router.get('/appointmentcount/:id',appointmentController.appoinmentCountforReward);

// view appointment for relevant user
router.get('/viewappointment/:id', appointmentController.getappointment);

//add appoinments
router.post('/createappointment',appointmentController.createAppoinment);
// checking availability of time slot for creating appointment
router.get('/createappointment',appointmentController.gettimeforappointment);

//cancel appointment
router.put('/cancelappointmnet/:id',appointmentController.updateAppointmentStatus);

//reshedule appointment
router.put('/resheduleappointmnet/:id',appointmentController.resheduleAppointment);

module.exports = router;
