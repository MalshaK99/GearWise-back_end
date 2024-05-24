
const mongoose = require("mongoose")

const mongoDBURL = "mongodb://localhost:27017/test";

 

mongoose.connect(mongoDBURL,{

    useNewUrlParser:true,

    useUnifiedTopology:true

})

 

mongoose.connection.once("open",()=>{

    console.log("MongoDB Connected")

})

 