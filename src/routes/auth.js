const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
const express = require("express");
require('dotenv').config();  // Ensure environment variables are loaded

// Function to sign JWT token
const signToken = (userID) => {
  console.log("Signing token for user:", userID);
  return JWT.sign(
    {
      iss: "Movie.log",
      sub: userID,
    },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
};


// Login success route
router.get("/login/success", (req, res) => {
  console.log("Login success route accessed");
  if (req.user) {
    console.log("User logged in:", req.user);
    res.status(200).json({
      error: false,
      message: "Successfully Logged In",
      user: req.user,
    });
  } else {
    console.log("Unauthorized access attempt to login success route");
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

// Login failure route
router.get("/login/failed", (req, res) => {
  console.log("Login failed route accessed");
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

// Google login route
router.get("/google", (req, res, next) => {
  console.log("Google authentication route accessed");
  next();
}, passport.authenticate("google", ["profile", "email"]));

// Google callback route with token generation
router.get(
  "/google/callback",
  (req, res, next) => {
    console.log("Google callback route accessed");
    next();
  },
  passport.authenticate("google", { failureRedirect: "/login/failed" }),
  (req, res) => {
    // Generate JWT token after successful Google authentication
    const userId = req.user._id;
    const loginType = 'google';

    const token = signToken(userId);

    // Redirect to client with token and loginType as URL parameters
    res.redirect(`${process.env.CLIENT_URL}/?token=${token}&loginType=${loginType}&userID=${userId}`);
  }
);

// Logout route for Google
router.get("/logout", (req, res) => {
  console.log("Logout route accessed");
  
  // Check if the user is logged in
  if (req.isAuthenticated()) {
    console.log("User is authenticated, proceeding to logout.");
    
    req.logout((err) => {
      if (err) {
        console.error("Error during Google logout:", err);
        return res.status(500).json({ message: "Google logout failed" });
      }

      console.log("User successfully logged out from Google");

      // Destroy session and clear cookies
      req.session.destroy((sessionErr) => {
        if (sessionErr) {
          console.error("Error destroying session:", sessionErr);
          return res.status(500).json({ message: "Session destruction failed" });
        }

        console.log("Session destroyed");
        res.clearCookie("connect.sid");
        return res.status(200).json({ message: "Successfully logged out" });
      });
    });
  } else {
    console.log("No user is logged in for logout");
    return res.status(400).json({ message: "No user is logged in" });
  }
});


// Local login route with JWT token
router.route("/")
  .post(passport.authenticate("local", { session: false }), (req, res) => {
    console.log("Local login route accessed");
    if (req.isAuthenticated()) {
      const { _id, first_name } = req.user;
      console.log("Authenticated user:", req.user);

      const token = signToken(_id);
      console.log("Token generated for user:", _id);

      res.status(200).json({
        isAuthenticated: true,
        user: first_name,
        token: token,
      });
    } else {
      console.log("Local login authentication failed");
      res.status(401).json({ error: true, message: "Authentication failed" });
    }
  });

module.exports = router;
