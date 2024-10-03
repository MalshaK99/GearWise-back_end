const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Customer = require("../models/customer"); // Adjust the path as needed
const JwtStrategy = require("passport-jwt").Strategy;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4005/api/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done, cb) => {
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
        const token = jwt.sign({ sub: customer.id }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });

        // await customer.save();
        // done(null, customer);
        return cb(null, { customer, token });
      } catch (error) {
        console.error("Error during Google strategy authentication:", err);
        return cb(err, null);
        // done(error, false);
      }
    }
  )
);

 // JWT Strategy
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

passport.serializeUser((customer, done) => {
  done(null, customer.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const customer = await Customer.findById(id);
    done(null, customer);
  } catch (error) {
    done(error, false);
  }
});
