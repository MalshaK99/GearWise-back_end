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

//get the count of ads
exports.getAdvertisementCount = async (req, res) => {
    try {
        const count = await Ad.countDocuments({ approved: false });
        res.status(200).json({ count });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all unapproved advertisements for admin
exports.getUnapprovedAdvertisements = async (req, res) => {
    try {
      const ads = await Ad.find({ approved: false });
      res.json(ads);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  // Approve an advertisement
  exports.approveAdvertisement = async (req, res) => {
    try {
      await Ad.findByIdAndUpdate(req.params.id, { approved: true });
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  // Delete an advertisement
  exports.deleteAdvertisement = async (req, res) => {
    try {
      await Ad.findByIdAndDelete(req.params.id);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };
  
  // Get all approved advertisements for customers(kasun)
  exports.getApprovedAdvertisements = async (req, res) => {
    try {
      const ads = await Ad.find({ approved: true });
      res.json(ads);
    } catch (error) {
      res.status(500).send(error.message);
    }
  };