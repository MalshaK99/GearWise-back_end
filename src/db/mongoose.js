const mongoose = require("mongoose");

const mongoDBURL = "mongodb://localhost:27017/test";

mongoose.connect(mongoDBURL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });
 