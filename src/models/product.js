const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const productSchema = new Schema({

    name :{

        type : String,

        required : true

    },

    quantity :{

        type:Number,

        required : true

    },

    price :{

        type : Number,

        required : true

    },
    date :{

        type : Date,

        required : true

    },
    s_name:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    }
    

})

 

const Product = mongoose.model("Product",productSchema)

 

module.exports = Product;