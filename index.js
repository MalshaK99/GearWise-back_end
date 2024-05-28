const express = require("express");
require("./src/db/mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const productRouter = require("./src/routes/product");
const adRouter = require("./src/routes/advertisment");  
const vehicleRouter=require("./src/routes/vehicle");
const customerRouter=require("./src/routes/customer");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(productRouter);
app.use(adRouter); 
app.use(vehicleRouter);
app.use(customerRouter);

const port = 4005;

app.listen(port, () => {
    console.log("Server is up & running on port " + port);
});
