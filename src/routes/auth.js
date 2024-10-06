const router = require("express").Router();
const passport = require("passport");
const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("api/auth/google/callback", passport.authenticate("google", {
  failureRedirect: "/login",
  successRedirect: "/home", // Redirect to the homepage or any other page after successful login
}));

module.exports = router;
