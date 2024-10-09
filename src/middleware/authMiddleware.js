// // middleware/auth.js
// const jwt = require('jsonwebtoken');

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// module.exports = authenticateToken;

//ksk
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.customerId) {
    next(); // Session exists, allow access
  } else {
    res.status(401).json({ message: "Unauthorized: Please log in" });
  }
};
module.exports = isAuthenticated;
//ksk