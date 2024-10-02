const mongoose = require("mongoose");
 

const Schema = mongoose.Schema;
 

const add_vehicleSchema = new Schema({
    
    vehicleType: {
        type: String,

        required: true
    },

    vehicleModel: {
        type: String,

        required: true
    },

    mfYear: {
        type: String,

        required: true
    },

    vrNo: {
        type: String,

        required: true
    }

     
     
}

);

const Add_Vehicle = mongoose.model("Add_Vehicle", add_vehicleSchema);

module.exports = Add_Vehicle;