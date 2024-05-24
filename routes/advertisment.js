const express = require("express");
const router = express.Router();
const Ad = require("../models/advertisment");
const multer = require("multer");
const path = require("path");

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create a new ad
router.post("/ad", upload.single("adImage"), async (req, res) => {
    try {
        const ad = new Ad({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            imagePath: req.file.path, // Save the path of the uploaded image
            description: req.body.description
        });

        await ad.save();
        res.status(201).send(ad);
    } catch (error) {
        res.status(400).send(error);
    }
});
  
// Get all products
router.get("/ad", async (req, res) => {
    try {
        const ad = await Ad.find({});
        res.status(200).send(ad);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
