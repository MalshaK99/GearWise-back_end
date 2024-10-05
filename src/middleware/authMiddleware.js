// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const JwtStrategy = require("passport-jwt").Strategy;
// const User = require("../models/user.model");

// require("dotenv").config();

// module.exports = function (passport) {
//   // CONFIGURE STRATEGIES

//   // Local
//   passport.use(User.createStrategy());

//   // Google
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "http://localhost:5000/auth/google/movie-log",
//       },
//       function (accessToken, refreshToken, profile, cb) {
//         User.findOrCreate(
//           { googleId: profile.id },
//           { first_name: profile.displayName, email: profile._json.email },
//           function (err, user) {
//             return cb(err, user);
//           }
//         );
//       }
//     )
//   );

//   // JWT
//   const cookieExtractor = (req) => {
//     let token = null;
//     if (req && req.cookies) {
//       token = req.cookies["access_token"];
//     }

//     return token;
//   };

//   passport.use(
//     new JwtStrategy(
//       {
//         jwtFromRequest: cookieExtractor,
//         secretOrKey: process.env.SECRET,
//       },
//       (payload, done) => {
//         User.findById(payload.sub, (err, user) => {
//           if (err) {
//             return done(err, false);
//           }
//           if (user) {
//             return done(null, user);
//           } else {
//             return done(null, false);
//           }
//         });
//       }
//     )
//   );

//   // CONFIGURE AUTHENTICATED SESSION PERSISTENCE
//   passport.serializeUser(function (user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//       done(err, user);
//     });
//   });
// };