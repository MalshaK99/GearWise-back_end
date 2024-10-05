require("dotenv").config();
const express = require("express");
require("./src/db/mongoose");
const passport = require("passport");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const sendEmail = require("./src/emailServer");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const productRouter = require("./src/routes/product");
const adRouter = require("./src/routes/advertisment");
const vehicleRouter = require("./src/routes/vehicle");
const customerRouter = require("./src/routes/customer");
const appointmentRouter = require("./src/routes/appoinment");
const reviewRouter = require("./src/routes/review_ratings");
const authRoute = require("./src/routes/auth");
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // If you're sending cookies or HTTP authentication
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Load Passport configuration
require("./passport")(passport);

// Define routes
app.use("/auth", authRoute);

// Local login route
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.status(200).send("Logged in successfully");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

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

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


const port = 4005;

app.listen(port, () => {
  console.log("Server is up & running on port " + port);
});
