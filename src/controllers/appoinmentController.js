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
    }).populate('appointmentId').populate('vehicleId');

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
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
