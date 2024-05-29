const Appointment=require("../models/appoinment");

//appoinment count
exports.getAppoinmentCount = async (req, res) => {
    try {
        const count = await Appointment.countDocuments({});
        res.status(200).json({ count });
    } catch (error) {
        res.status(400).send(error);
    }
};