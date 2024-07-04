const Vehicle = require("../models/vehicle");
const Customer = require('../models/customer');
const Product = require("../models/product");
const Appointment= require("../models/appoinment")
const mongoose = require('mongoose');


// add vehicle using mod dashboard
exports.createVehicle = async (req, res) => {
    const { vehicle_no, v_type, s_type, s_date, owner } = req.body;

    try {
        // Validate the customer ID
        const customer = await Customer.findById(owner);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Create a new vehicle entry
        const vehicle = new Vehicle({
            vehicle_no,
            v_type,
            s_type,
            s_date,
            owner 
        });

        await vehicle.save();
        res.status(201).send(vehicle);
    } catch (error) {
        console.error('Error creating vehicle:', error);
        res.status(400).send(error);
    }
};

// Fetch customer list
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).send(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        res.status(500).send(error);
    }
};

// Get a Vehicle by ID
exports.getVehicleById = async (req, res) => {
    const _id = req.params.id;

    try {
        const vehicle = await Vehicle.findById(_id);
        if (!vehicle) {
            return res.status(404).send();
        }
        res.status(200).send(vehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};


exports.updateVehicleById = async (req, res) => {
    const { vehicle_no } = req.params;
    const { nextS_date, replacedParts } = req.body;

    try {
        const updatedFields = {};

        if (nextS_date) {
            updatedFields.nextS_date = nextS_date;

            // Update the nextS_date in the Appointment collection
            await Appointment.findOneAndUpdate(
                { vrNo: vehicle_no },
                { $set: { nextS_date: nextS_date } }
            );
        }

        // Update the product quantities based on replaced parts
        if (replacedParts && replacedParts.length > 0) {
            for (const part of replacedParts) {
                const product = await Product.findById(part.productId);

                if (product) {
                    // Check if the new quantity will be >= 0
                    const newQuantity = product.quantity - part.quantity;
                    if (newQuantity < 0) {
                        return res.status(400).send({ message: `Quantity cannot be less than 0 for product ${product.name}` });
                    }
                    // Update only the quantity
                    await Product.findByIdAndUpdate(part.productId, { $set: { quantity: newQuantity } });
                } else {
                    return res.status(404).send({ message: `Product with id ${part.productId} not found` });
                }
            }
        }

        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { vehicle_no: vehicle_no },
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedVehicle) {
            return res.status(404).send({ message: 'Vehicle not found' });
        }

        res.status(200).send(updatedVehicle);
    } catch (error) {
        console.error('Error updating vehicle fields:', error);
        res.status(400).send(error);
    }
};


// Delete a vehicle by ID
exports.deleteVehicleById = async (req, res) => {
    const _id = req.params.id;

    try {
        const deletedVehicle = await Vehicle.findByIdAndDelete(_id);
        if (!deletedVehicle) {
            return res.status(404).send();
        }
        res.status(200).send(deletedVehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};

// hasanki
// add vehicle history(Appoinment details)
exports.addHistory = async (req, res) => {
    console.log(req.body);
    const history = new Appointment(req.body);


    try {
        await history.save();
        res.status(201).send(history);
    } catch (error) {
        res.status(400).send(error);
    }
};

//get specific vehicle history(Appoinment) detail  
// exports.getHistory = async (req, res) => {

//     //  router.get("/users/:id",async(req,res)=>{
//     const _id = req.params.id;


//     try {
//         const history = await HistoryAp.findById(_id)
//         // const customer = await Customer.find()

//         if (!history) {
//             return res.status(404).send
//         }
//         res.status(201).send(history)
//     } catch (error) {
//         res.status(400).send(error)
//     }
// };

 
// Route to get all appointments for a specific vehicle and fetching the details =vrNo
exports.getHistory = async (req, res) => {
    const vrNo = req.params.vrNo; // Retrieve vehicle registration number from params

    try {
        const history = await Appointment.find({ vrNo: vrNo });

        if (!history || history.length === 0) {
            return res.status(404).json({ message: 'No history found for this vehicle.' });
        }

        res.status(200).json(history); // Return array of all appointments matching vrNo
    } catch (error) {
        console.error('Error fetching vehicle history:', error);
        res.status(500).json({ message: 'Server error.' });
    }
};

// add vehicle and product details for the history
// exports.addVehicleWithProducts = async (req, res) => {
//     try {
//         const { vehicle_no, cus_name, v_type, s_type, s_date, nextS_date, replacedParts, owner } = req.body;

//         // Add product details
//         const addedParts = await Promise.all(replacedParts.map(async part => {
//             const product = new Product({
//                 name: part.name,
//                 quantity: part.quantity,
//                 price: part.price,
//                 date: part.date,
//                 s_name: owner // assuming owner is the supplier as well
//             });
//             await product.save();
//             return { productId: product._id, quantity: part.quantity };
//         }));

//         // Add vehicle details
//         const vehicle = new Vehicle({
//             vehicle_no,
//             cus_name,
//             v_type,
//             s_type,
//             s_date,
//             nextS_date,
//             replacedParts: addedParts,
//             owner
//         });

//         await vehicle.save();
//         res.status(201).send(vehicle);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// };

// // Get vehicle details and the product details with parts
// exports.getVehicleWithParts = async (req, res) => {
//     try {
//         const vehicle = await Vehicle.findById(req.params.id)
//             .populate('owner')  // Populate the owner field
//             .populate({
//                 path: 'replacedParts.productId',
//                 model: 'Product',
//                 select: 'name quantity price'  // Ensure the product details are selected
//             });  // Populate the productId field in replacedParts

//         if (!vehicle) {
//             return res.status(404).send({ message: "Vehicle not found" });
//         }

//         console.log('Vehicle Data:', vehicle);  // Add this line
//         res.status(200).send(vehicle);
//     } catch (error) {
//         console.error('Error fetching vehicle data:', error);  // Add this line
//         res.status(500).send(error);
//     }
// };
