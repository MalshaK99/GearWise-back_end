const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

// Signup controller
exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ status: 'exist', message: 'User already exists' });
    }

    const user = new User({ email, password });
    await user.save();
    
    return res.status(201).json({ status: 'success', message: 'User created' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

// Login controller
exports.login = async (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ status: 'notexist', message: 'Invalid email or password' });
    }
    req.logIn(user, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.status(200).json({ status: 'exist', customerId: user._id });
    });
  })(req, res, next);
};

// Google authentication route
exports.googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email']
});

// Google authentication callback
exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', async (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (!user) {
      return res.redirect('/login'); // Redirect if user is not found
    }

    // Find or create the user in your database
    let existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      existingUser = new User({ email: user.email });
      await existingUser.save();
    }

    req.logIn(existingUser, (err) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      // Successful login
      return res.status(200).json({ status: 'exist', customerId: existingUser._id });
    });
  })(req, res, next);
};

// Logout controller
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/'); // Redirect to home page or any page
};
