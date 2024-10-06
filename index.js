require("dotenv").config();
const express = require("express");
require("./src/db/mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const sendEmail = require("./src/emailServer");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const axios = require('axios');
const passport = require("passport");
const passportConfig = require("./src/services/passport"); // Ensure this path is correct
const cors = require("cors"); // Add this line

const productRouter = require("./src/routes/product");
const adRouter = require("./src/routes/advertisment");
const vehicleRouter = require("./src/routes/vehicle");
const customerRouter = require("./src/routes/customer");
const appointmentRouter = require("./src/routes/appoinment");
const reviewRouter = require("./src/routes/review_ratings");
const cookieSession = require("cookie-session");
const authRoute = require("./src/routes/auth");
// const path = require("path");
// const sendEmail = require("./src/emailServer");


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


// CORS setup
app.use(cors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));

// Body parser setup
app.use(bodyParser.json());

// Passport setup
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret', // Use a strong secret key
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Use the auth routes

// Load Passport configuration

// Route handlers
app.use("/api/products", productRouter);
app.use("/api/ads", adRouter);
app.use("/api/vehicles", vehicleRouter);
app.use("/api/customers", customerRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/auth", authRoute);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Email sending endpoint
app.post("/api/send-email", async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    await sendEmail({ to, subject, text });
    res.status(200).send("Email sent successfully");
  } catch (error) {
    res.status(500).send("Failed to send email");
  }
});

// Google OAuth routes
app.use("/auth", authRoute);

// Route to calculate distance using Google Maps API
app.get('/api/distance', async (req, res) => {
  const { origin, destination, waypoints } = req.query;
  console.log("Request received:", { origin, destination, waypoints });
  try {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json`, {
      params: {
        origin,
        destination,
        waypoints,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    });
    console.log("Response from Google Maps API:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error calling Google Maps API:", error);
    res.status(500).send(error.message);
  }
});

const port = 4005;

app.listen(port, () => {
  console.log("Server is up & running on port " + port);
});
