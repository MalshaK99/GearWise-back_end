const Appointment = require('../models/appoinment');
const { format } = require('date-fns');


//get appointment by next S_date( for Time based alerts-no)
exports.getAppointmentsByN_SDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }
    //check whether date obj is valid
    const startDate = new Date(date);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    const appointments = await Appointment.find({
      nextS_date: {
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


//get appointmnet by date
exports.getAppointmentsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: 'Date query parameter is required' });
    }

    // seperate incoming date string in 'YYYY-MM-DD' format
    const [year, month, day] = date.split('-').map(Number);

    // Create a new Date object using the parsed components
    const startDate = new Date(year, month - 1, day);
    if (isNaN(startDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Format startDate to match 'MM/DD/YYYY' format stored in MongoDB
    const formattedStartDate = `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;

    // Calculate endDate as the next day
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);

    console.log('Querying appointments from:', formattedStartDate, 'to', endDate.toLocaleDateString('en-US'));

    // Query appointments using $gte (greater than or equal to) startDate and $lt (less than) endDate
    const appointments = await Appointment.find({
      date: {
        $gte: formattedStartDate,
        $lt: format(endDate, 'MM/dd/yyyy') // Ensure endDate is formatted correctly
      }
    }).populate('customerId'); // Assuming customerId is the correct field to populate

    console.log('Appointments:', appointments);

    res.json({ appointments });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

//up next s date
exports.updateNextServiceDate = async (req, res) => {
  try {
      const { vehicle_no } = req.params;
      const { nextS_date } = req.body;

      const appointment = await Appointment.findOneAndUpdate(
        { vrNo: vehicle_no },
        { $set: { nextS_date } },
          { new: true }
      );

      if (!appointment) {
          return res.status(404).json({ message: 'Appointment not found' });
      }

      res.json(appointment);
  } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

//count
exports.appoinmentCount = async (req, res) => {
  try {
    const now = new Date();
    const currentDate = formatDate(now); // Format current date in MM/DD/YYYY

    // Fetch appointments and filter those occurring after the current date
    const appointments = await Appointment.find();

    const filteredAppointments = appointments.filter(appointment => {
      const appointmentDate = formatDate(new Date(appointment.date));
      return appointmentDate > currentDate;
    });

    const count = filteredAppointments.length;

    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Helper function to format date in MM/DD/YYYY format
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString();
  return `${month}/${day}/${year}`;
}

//below are kasun's
// for rewarding
exports.appoinmentCountforReward = async (req, res) => {
  try {
      const customerId = req.params.id;

        const count = await Appointment.countDocuments({customerId:customerId});
        res.status(200).json({ count });
      } catch (error) {
        res.status(500).json({ error: 'An error occurred while counting appointments.' });
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

  //reshedule appointmnet
  exports.resheduleAppointment = async (req, res) => {
    const appointmentId = req.params.id;
    const { timeSlot,date } = req.body;
  
    try {
      const resheduleAppointment = await Appointment.findByIdAndUpdate(appointmentId, { timeSlot:timeSlot,date:date}, { new: true });
  
      if (!resheduleAppointment) {
        return res.status(404).send({ message: 'Appointment not found' });
      }
  
      res.status(200).send(resheduleAppointment);
    } catch (error) {
      res.status(400).send({ message: 'Error resheduling appointment ', error });
    }
  };
