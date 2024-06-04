const express = require("express");
const router = express.Router();
const review_ratingController = require("../controllers/review_ratingController");

router.post("/reviews", review_ratingController.addReview);
// router.post("/users",async(req,res)=>{

module.exports = router;