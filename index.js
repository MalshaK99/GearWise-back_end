const express = require("express");
require("./db/mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const productRouter = require("./routes/product");
const orderRouter = require("./routes/advertisment");  

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(productRouter);
app.use(orderRouter); 

const port = 4005;

app.listen(port, () => {
    console.log("Server is up & running on port " + port);
});
