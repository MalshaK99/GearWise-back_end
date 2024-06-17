const Appointment = require('../models/appoinment');

exports.getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    const startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const appointments = await Appointment.find({
      date: {
        $gte: startDate,
        $lt: endDate
      }
    }).populate('customerId'); // Populate customerId instead of appointmentId

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
exports.appoinmentCount = async (req, res) => {
  try {
      const now = new Date();

      const count = await Appointment.countDocuments({
          date: { $gt: now }
      });

      res.status(200).json({ count });
  } catch (error) {
      res.status(400).json({ error: error.message });
  }
};
// Create a new 
exports.createAppoinment = async (req, res) => {
    console.log(req.body);
    const appoinment = new Appointment(req.body);

    try {
        await appoinment.save();
        res.status(201).send(appoinment);
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.getappointment = async (req, res) => {

  //  router.get("/users/:id",async(req,res)=>{
      const _id = req.params.id;
  
  
      try {
        // find the relevant appointments releated to the one customer
          const appointment = await Appointment.find({customerId:_id})
          // const appointment = await appointment.find()
          if(!appointment){
              return res.status(404).send
          }
          res.status(201).send(appointment)
      } catch (error) {
          res.status(400).send(error)
      }
  };

//cancel appointment
  exports.updateAppointmentStatus = async (req, res) => {
    const appointmentId = req.params.id;
    const { status } = req.body;
  
    try {
      const updatedAppointment = await Appointment.findByIdAndUpdate(appointmentId, { status: status }, { new: true });
  
      if (!updatedAppointment) {
        return res.status(404).send({ message: 'Appointment not found' });
      }
  
      res.status(200).send(updatedAppointment);
    } catch (error) {
      res.status(400).send({ message: 'Error updating appointment status', error });
    }
  };
