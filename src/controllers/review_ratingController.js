const Review_ratings = require("../models/review_ratings");


//add review 
exports.addReview = async (req, res) => {
    // console.log(req.body);
    const review = new Review_ratings(req.body);


    try {
        await review.save();
        res.status(201).send(review);
    } catch (error) {
        res.status(400).send(error);
    }
};


//get all review and ratings
exports.getReviews = async (req, res) => {
    // console.log(req.body);
    // const review = new review(req.body);

    try {
        const reviews = await Review_ratings.find({});
        res.status(201).send(reviews);
    } catch (error) {
        res.status(400).send(error);
    }
};
