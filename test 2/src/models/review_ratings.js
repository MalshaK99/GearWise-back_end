const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const review_ratingsSchema = new Schema({

    name :{

        type : String,

        required : true

    },

    rating :{

        type:Number,

        required : true

    },

    review :{

        type : String,

        required : true

    }

})

 

const Review_Ratings = mongoose.model("Review_Ratings",review_ratingsSchema)

 

module.exports = Review_Ratings;