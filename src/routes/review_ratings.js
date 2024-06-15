const express = require("express");
const router = express.Router();
const review_ratingController = require("../controllers/review_ratingController");


//Add review and ratings
router.post("/reviews", review_ratingController.addReview);
// router.post("/users",async(req,res)=>{


//Get all review and ratings
router.get("/reviews", review_ratingController.getReviews);
module.exports = router;