const router = require("express").Router();
const passport = require("passport");
const JWT = require("jsonwebtoken");
const express = require("express");



router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully Loged In",
      user: req.user,
    });
  } else {
    res.status(403).json({ error: true, message: "Not Authorized" });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Log in failure",
  });
});

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

//jwt  foir local authentication
const signToken = (userID) => {
  return JWT.sign(
    {
      iss: "Movie.log",
      sub: userID,
    },
    process.env.SECRET,
    { expiresIn: "1h" }
  );
};

router
  .route("/")
  .post(passport.authenticate("local", { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
      const { _id, first_name } = req.user;

      const token = signToken(_id);
      res.cookie("access_token", token, { httpOnly: true, sameSite: true });

      res.status(200).json({
        isAuthenticated: true,
        user: first_name
      });
    }
  });

module.exports = router;
