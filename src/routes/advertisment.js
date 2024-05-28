// routes/advertisementRoutes.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const advertisementController = require("../controllers/adController");

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
router.post("/", upload.single("adImage"), advertisementController.createAdvertisement);

// Get all advertisements
router.get("/", advertisementController.getAllAdvertisements);

// Get count of all advertisements
router.get("/count", advertisementController.getAdvertisementCount);

module.exports = router;
