const GoogleStrategy = require("passport-google-oauth20").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Assuming the Customer model is located in the following path
const Customer = require("./src/models/Customer"); // Update the path if necessary

module.exports = function(passport) {
  // Local Strategy for email/password login
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      try {
        const customer = await Customer.findOne({ email });
        if (!customer) {
          return done(null, false, { message: "Incorrect email." });
        }
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }

        // Generate JWT token for the customer upon successful login
        const token = jwt.sign({ sub: customer.id }, process.env.JWT_SECRET, {
          expiresIn: '1h',
        });

        // Pass customer and token for session handling
        return done(null, { customer, token });
      } catch (err) {
        return done(err);
      }
    })
  );

  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:4005/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          let customer = await Customer.findOne({ googleId: profile.id });
          if (!customer) {
            customer = await Customer.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile._json.email,
              profilePhoto: profile.photos[0].value,
            });
          }

          // Generate JWT token for the customer upon successful login
          const token = jwt.sign({ sub: customer.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });

          // Pass customer and token for session handling
          return cb(null, { customer, token });
        } catch (err) {
          console.error("Error during Google strategy authentication:", err);
          return cb(err, null);
        }
      }
    )
  );

  // JWT Strategy for protecting routes
  const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies["access_token"];
    }
    return token;
  };

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const customer = await Customer.findById(payload.sub);
          if (customer) {
            return done(null, customer);
          } else {
            return done(null, false);
          }
        } catch (err) {
          console.error("Error during JWT strategy authentication:", err);
          return done(err, false);
        }
      }
    )
  );

  // Serialize user into the session
  passport.serializeUser((user, done) => {
    if (user.customer) {
      done(null, user.customer.id); // Google strategy returns { customer, token }
    } else {
      done(null, user.id); // Local strategy returns customer object directly
    }
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const customer = await Customer.findById(id);
      done(null, customer);
    } catch (err) {
      done(err, null);
    }
  });
};
