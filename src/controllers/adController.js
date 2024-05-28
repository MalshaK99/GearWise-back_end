// controllers/advertisementController.js

const Ad = require("../models/advertisment");

// Create a new advertisement
exports.createAdvertisement = async (req, res) => {
    try {
        const ad = new Ad({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            imagePath: req.file.path,
            description: req.body.description
        });

        await ad.save();
        res.status(201).send(ad);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all advertisements
exports.getAllAdvertisements = async (req, res) => {
    try {
        const ads = await Ad.find({});
        res.status(200).send(ads);
    } catch (error) {
        res.status(400).send(error);
    }
};
//get the count of ads
exports.getAdvertisementCount = async (req, res) => {
    try {
        const count = await Ad.countDocuments({});
        res.status(200).json({ count });
    } catch (error) {
        res.status(400).send(error);
    }
};