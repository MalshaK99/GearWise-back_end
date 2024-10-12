const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.customerId) {
    next(); // Session exists, allow access
  } else {
    res.status(401).json({ message: "Unauthorized: Please log in" });
  }
};
module.exports = isAuthenticated;
