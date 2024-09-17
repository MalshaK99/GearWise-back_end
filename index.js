require("dotenv").config();
const express = require("express");
require("./src/db/mongoose");
require("./passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const productRouter = require("./src/routes/product");
const adRouter = require("./src/routes/advertisment");
const vehicleRouter = require("./src/routes/vehicle");
const customerRouter = require("./src/routes/customer");
const appointmentRouter = require("./src/routes/appoinment");
const reviewRouter = require("./src/routes/review_ratings");
const cookieSession = require("cookie-session");
const authRoute = require("./src/routes/auth");
const path = require("path");
const sendEmail = require("./src/emailServer");

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["cyberwolve"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PATCH,PUT,DELETE",
    credentials: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use("/api/products", productRouter);
app.use("/api/ads", adRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/customers", customerRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/auth", authRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.post("/api/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail({ to, subject, text });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Failed to send email");
  }
});

const port = 4005;

app.listen(port, () => {
  console.log("Server is up & running on port " + port);
});
