const Customer = require("../models/customer");
const Vehicle = require("../models/vehicle");
const Appointment = require("../models/appoinment");
const customerService = require("../services/customerService");

const bcrypt = require('bcrypt');


exports.register = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;

        const successRes = await customerService.registerCustomer(
            name,
            email,
            phone,
            gender,
            address,
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
// exports.login = async (req, res, next) => {
//     try {
//         const { email, password } = req.body;
//         console.log("Received login request for:", email);

//         const customer = await customerService.checkCustomer(email);
//         if (!customer) {
//             console.log("Customer not found for email:", email);
//             return res.status(401).json({ status: false, error: "Invalid email or password" });
//         }

//         const isMatch = await bcrypt.compare(password, customer.password);
//         if (!isMatch) {
//             console.log("Password mismatch for email:", email);
//             return res.status(401).json({ status: false, error: "Invalid email or password" });
//         }

//          // Store customerId in session ksk
//         req.session.customerId = customer._id;
//         res.status(200).json({ status: true, message: "Login successful", customerId: customer._id });
//         //ksk

//         // const tokenData = {
//         //     _id: customer._id,
//         //     email: customer.email,
//         //     name: customer.name,
//         // };
//         // const token = await customerService.generateToken(tokenData, process.env.JWT_SECRET, "1h");

//         // console.log("Login successful for email:", email);
//         // res.status(200).json({ status: true, token: token });
//     } catch (error) {
//         console.error("Login Error:", error);
//         res.status(500).json({ status: false, error: "Internal Server Error" });
//     }
// };
//ksk for logout
exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ status: false, message: "Failed to log out" });
      }
      res.clearCookie('session');
      res.status(200).json({ status: true, message: "Logged out successfully" });
    });
  };

exports.session = (req, res) => {
    if (req.session && req.session.customerId) {
        res.json({ customerId: req.session.customerId });
        console.log("session id:",req.session)
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
  };
//ksk 


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
        // Check if email or password is empty
    if (!email || !password) {
        return res.json({ error: "Email and password are required" });
    }
        const customer = await Customer.findOne({ email: email });
        if (!customer) {
            return res.json({ status: "notexist" }); // No customer with that email
        }
        // Compare password with hashed password
        const validPassword = await bcrypt.compare(password, customer.password);
        if (!validPassword) {
            return res.json({ status: "Incorrect_password" }); // Incorrect password
        }
        // If both email and password match, login success
        req.session.customerId = customer._id; // Store customerId in session
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
// exports.signupCustomer = async (req, res) => {
//     const customer = new Customer(req.body);
//     console.log(customer)
//         try {
//         await customer.save();
//         res.status(201).send(customer);
//     } catch (error) {
//         res.status(400).send(error);
//     }

// };
// Signup controller with additional error logging
// Signup controller with email conflict handling
//sigup


exports.signupCustomer = async (req, res) => {
    const { name, email, phone, gender, address, password } = req.body;

    console.log("Received signup data:");
    console.log({ email, name, phone, gender, address, password });

    try {
        // Check if customer already exists by email
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            return res.status(400).send({ message: "User already exists" });
        }

        // Create a new customer and save to the database
        const customer = new Customer({ name, email, phone, gender, address, password });
        await customer.save();
        console.log("Customer registered successfully:", customer);

        res.status(201).send({ message: "Customer registration successful" });
    } catch (error) {
        console.error("Error during customer registration:", error);
        res.status(500).send({ message: "An error occurred during registration", error: error.message });
    }
};







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

// Update customer password
exports.updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const _id = req.params.id;

    try {
        // Find the customer by ID
        const customer = await Customer.findById(_id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Compare current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, customer.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Check if new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match' });
        }

        // Check if the new password is the same as the current password (in plain text)
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: 'New password cannot be the same as the current password' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the customer's password (hashed password)
        customer.password = hashedPassword;
        await customer.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};