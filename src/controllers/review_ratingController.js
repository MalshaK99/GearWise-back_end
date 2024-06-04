const eview_Ratings = require("../models/review_ratings");


//add review 
exports.addReview = async (req, res) => {
    // console.log(req.body);
    const review = new Review(req.body);


    try {
        await review.save();
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send(error);
    }
};
 