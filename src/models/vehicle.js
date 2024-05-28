const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const vehicleSchema = new Schema({

    vehicle_no :{

        type : String,
        unique: true,
        required : true

    },

    v_type :{

        type:String,

        required : true

    },

    s_type :{

        type : String,

        required : true

    },
    s_date :{

        type : Date,

        required : true

    },
    nextS_date :{

        type : Date,
        default: null


    },
    replacedParts :{

        type : String,
        default: null


    }

})

 

const Vehicle = mongoose.model("Vehicle",vehicleSchema)

 

module.exports = Vehicle;