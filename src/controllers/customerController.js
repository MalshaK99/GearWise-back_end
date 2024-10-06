const Customer =require("../models/customer");
const Vehicle = require("../models/vehicle");
const Appointment = require("../models/appoinment");
const customerService = require("../services/customerService");

const bcrypt = require("bcrypt");

exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const successRes = await customerService.registerCustomer(
      name,
      email,
      phone,
      password
    );

    if (successRes.success) {
      res.status(201).json({ status: true, message: successRes.message });
    } else {
      res.status(400).json({ status: false, error: successRes.message });
    }
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("Received login request for:", email);

    const customer = await customerService.checkCustomer(email);
    if (!customer) {
      console.log("Customer not found for email:", email);
      return res.status(401).json({ status: false, error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      console.log("Password mismatch for email:", email);
      return res.status(401).json({ status: false, error: "Invalid email or password" });
    }

    const tokenData = {
      _id: customer._id,
      email: customer.email,
      name: customer.name,
    };
    const token = await customerService.generateToken(tokenData, process.env.JWT_SECRET, "1h");

    console.log("Login successful for email:", email);
    res.status(200).json({ status: true, token: token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ status: false, error: "Internal Server Error" });
  }
};

exports.getAllCustomers = async (req, res) => {
    try {
        // Get all customers
        const customers = await Customer.find({ role: 'customer' }).lean();

        // Fetch details for each customer
        const customersWithDetails = await Promise.all(
            customers.map(async (customer) => {
                // Get vehicle information for the customer
                const vehicle = await Vehicle.findOne({ owner: customer._id });

                // Count the number of appointments for the customer
                const appointmentCount = await Appointment.countDocuments({ customerId: customer._id });

                // Get vehicle information from appointment table
                const appointments = await Appointment.find({ customerId: customer._id }).select('vehicleType vrNo');

                return {
                    ...customer,
                    vehicle,
                    appointmentCount,
                    appointments
                };
            })
        );

        res.status(200).send(customersWithDetails);
    } catch (error) {
        console.error(error);
        res.status(400).send(error);
    }
};
//get suppliers
exports.fetchSuppliers = async (req, res) => {
    try {
        const suppliers = await Customer.find({ role: 'supplier' }, 'name email'); // Fetch name and email
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//get customer email,pw to logging
// Fetch customer email and password for login
exports.fetchCustomer = async (req, res) => {
    const { email, password } = req.body;
  
    try {
        const customer = await Customer.findOne({ email: email });

        if (!customer) {
            return res.json({ status: "notexist" }); // No customer with that email
        }

        // Compare password with hashed password
        const validPassword = await bcrypt.compare(password, customer.password);
        if (!validPassword) {
            return res.json({ status: "notexist" }); // Incorrect password
        }

        // If both email and password match, login success
        res.json({ status: "exist", customerId: customer._id });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal server error" });
    }
};


// Toggle customer status(admin dash)
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
//cus count
exports.getCustomerCount = async (req, res) => {
    try {
        const count = await Customer.countDocuments({ status: "active", role: 'customer' });
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

//sigup
exports.signupCustomer = async (req, res) => {
    const customer = new Customer(req.body);
    console.log(customer.email)
        try {
        await customer.save();
        res.status(201).send({ message: "Customer registration successful" });
    } catch (error) {
        res.status(400).send({ message: "User already exists" });
    }
    // const { email, password, username,profilephoto,address, gender,phoneno } = req.body;
    // const data={
    //   email:email,
    //   password:password,
    //   username: username,
    //   profilephoto:profilephoto,
    //   address:address,
    //   gender:gender,
    //   phoneno:phoneno,
    // }

    // try {
    //   const check = await Customer.find({email:email });
    //     console.log(check)
    //   if (check) {
    //     res.json("exist"); 
    //   } else {
    //     res.json("notexist");
    //     await customer.save();
    //     res.status(201).send(customer);
    //   }
    // } catch (e) {
    //   res.json("error")
  
    // };
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
// and for make appointment
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





