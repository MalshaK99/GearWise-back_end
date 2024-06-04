const express = require("express");
require("./src/db/mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const productRouter = require("./src/routes/product");
const adRouter = require("./src/routes/advertisment");
const vehicleRouter = require("./src/routes/vehicle");
const customerRouter = require("./src/routes/customer");
const appointmentRouter = require("./src/routes/appoinment");
const reviewRouter = require("./src/routes/review_ratings");
const path = require('path'); 

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/products", productRouter);
app.use("/api/ads", adRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/customers", customerRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/reviews", reviewRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 4005;

app.listen(port, () => {
  console.log("Server is up & running on port " + port);
});
