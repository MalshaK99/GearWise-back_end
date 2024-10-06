const Vehicle = require("../models/vehicle");
const Customer = require('../models/customer');
const Product = require("../models/product");
const Appointment= require("../models/appoinment")
const Add_Vehicle = require("../models/add_vehicle")
const mongoose = require('mongoose');

//fetch all vehicles
exports.getAllVehicles = async (req, res) => {
    try {
        // Fetch all vehicles and populate the owner field with customer details
        const vehicles = await Vehicle.find()
            .populate({
                path: 'owner',
                select: 'name email'  // Fields to include from the Customer model
            })
            .exec();

        if (vehicles.length > 0) {
            return res.status(200).json(vehicles);
        } else {
            return res.status(404).json({ message: 'No vehicles found' });
        }
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        return res.status(500).json({ message: 'Server error', error });
    }
};


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
  
      // If next service date is provided, update nextS_date in the Vehicle and Appointment collections
      if (nextS_date) {
        updatedFields.nextS_date = nextS_date;
  
        // Update nextS_date in the Appointment collection
        await Appointment.findOneAndUpdate(
          { vrNo: vehicle_no },
          { $set: { nextS_date: nextS_date } }
        );
      }
  
      // If replaced parts are provided, update product quantities and add parts to the Vehicle's replacedParts array
      if (replacedParts && replacedParts.length > 0) {
        for (const part of replacedParts) {
          const product = await Product.findById(part.productId);
  
          if (product) {
            // Check if the new quantity will be >= 0
            const newQuantity = product.quantity - part.quantity;
            if (newQuantity < 0) {
              return res.status(400).send({ message: `Quantity cannot be less than 0 for product ${product.name}` });
            }
  
            // Update product quantity
            await Product.findByIdAndUpdate(part.productId, {
              $set: { quantity: newQuantity }
            });
  
            console.log(`Updated quantity for product ${product.name} (ID: ${part.productId}) to ${newQuantity}`);
          } else {
            return res.status(404).send({ message: `Product with id ${part.productId} not found` });
          }
        }
  
        // Add the replaced parts to the vehicle's replacedParts array
        updatedFields.replacedParts = replacedParts;
      }
  
      // Update vehicle data with nextS_date and replacedParts
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
      res.status(400).send({ message: 'Error updating vehicle', error });
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

 
// add new vehicle to (My Vehicle) //has
exports.addNewVehicle = async (req, res) => {
    console.log(req.body);
    const newVehicle = new Add_Vehicle(req.body);


    try {
        await newVehicle.save();
        res.status(201).send(newVehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};


//Delete Added vehicles in (My Vehicle)
exports.deleteAddedMyVehicle = async (req, res) => {
    const _id = req.params.id;

    try {
        const deleteMyVehicle = await Add_Vehicle.findByIdAndDelete(_id);
        if (!deleteMyVehicle) {
            return res.status(404).send();
        }
        res.status(200).send(deleteMyVehicle);
    } catch (error) {
        res.status(400).send(error);
    }
};

//Update Added vehicle in (My vehicle)
exports.updateMyVehicle = async (req, res) => {

     
    const _id = req.params.id;

    try {
        const updated_MyVehicle = await Customer.findByIdAndUpdate(_id, req.body, { new: true })

        if (!updated_MyVehicle) {
            return res.status(404).send()
        }

        res.status(200).send(updated_MyVehicle)
    } catch (error) {
        res.status(400).send(error)
    }
};


// get vehicle info for make appointment
exports.getvehicleinfo = async (req, res) => {

    //  router.get("/users/:id",async(req,res)=>{
            // const _id = "665e144096c5017136fb33a0";

    const customerId = req.params.id;
    // console.log("cusid:",customerId);
    try {
        const cusvehicleinfo = await Add_Vehicle.find({ customerId: customerId });
        // const cusvehicleinfo = await Add_Vehicle.find()

        if (!cusvehicleinfo) {
            return res.status(404).send({ message: "Vehicle not found" });
        }
        res.status(201).send(cusvehicleinfo)
    } catch (error) {
        res.status(400).send({ message: "Error fetching vehicle info", error });
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
