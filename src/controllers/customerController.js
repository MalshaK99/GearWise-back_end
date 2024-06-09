const Customer = require("../models/customer");
const Vehicle = require("../models/vehicle");
const Appointment = require("../models/appoinment");
// Get all customers with their vehicles and appointment counts
exports.getAllCustomers = async (req, res) => {
    try {
        // Get all customers
        const customers = await Customer.find({})
            .populate('vehicle')
            .lean();

        // For each customer, get the appointment count
        const customersWithAppointments = await Promise.all(
            customers.map(async (customer) => {
                // Get the customer's vehicle
                const vehicle = await Vehicle.findOne({ owner: customer._id });

                // Count the number of appointments for the customer
                const appointmentCount = await Appointment.countDocuments({ customerId: customer._id });

                // Add vehicle and appointment count to the customer object
                return {
                    ...customer,
                    vehicle,
                    appointmentCount
                };
            })
        );

        res.status(200).send(customersWithAppointments);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
};

// Add customer (just to test)
exports.createCustomer = async (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);

    try {
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Toggle customer status
exports.toggleCustomerStatus = async (req, res) => {
    try {
        const { customerId } = req.params;

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Toggle status
        customer.status = customer.status === "active" ? "deactivated" : "active";
        await customer.save();

        res.status(200).json({ message: "Customer status updated successfully", customer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
//user count
exports.getCustomerCount = async (req, res) => {
    try {
        const count = await Customer.countDocuments({});
        res.status(200).json({ count });
    } catch (error) {
        res.status(400).send(error);
    }
};

// //add customer
// router.post("/users",async(req,res)=>{

//     // console.log(req.body);
//     const user = new User(req.body);

//     try {
//         await user.save();  
//         res.status(201).send(user)
//     } catch (error) {
//         res.status(400).send(error)       
//     }
// });

//add customer 
exports.addCustomer = async (req, res) => {
    console.log(req.body);
    const customer = new Customer(req.body);


    try {
        await customer.save();
        res.status(201).send(customer);
    } catch (error) {
        res.status(400).send(error);
    }
};

// //get all customers userprofile
// exports.getCustomerprofile = async (req, res) => {
//     // console.log(req.body);
//     // const customer = new Customer(req.body);

//     try {
//         const customer = await Customer.find({});
//         res.status(201).send(customer);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// };


 
 //get specific user detail for userprofile
 // and for appointment form details
 //exports.getOneCusprofile = async (req, res) => {

//get specific user detail for userprofile
exports.getOneCusprofile = async (req, res) => {

    //  router.get("/users/:id",async(req,res)=>{
    const _id = req.params.id;


    try {
        const customer = await Customer.findById(_id)
        // const customer = await Customer.find()

        if (!customer) {
            return res.status(404).send
        }
        res.status(201).send(customer)
    } catch (error) {
        res.status(400).send(error)
    }
};


//Update userProfile
exports.updateProfile = async (req, res) => {

    // router.put("/users/:id",async(req,res)=>{
    const _id = req.params.id;

    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(_id, req.body, { new: true })

        if (!updatedCustomer) {
            return res.status(404).send()
        }

        res.status(200).send(updatedCustomer)
    } catch (error) {
        res.status(400).send(error)
    }
};





