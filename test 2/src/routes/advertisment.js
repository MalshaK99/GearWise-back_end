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


// Get count of all advertisements
router.get("/count", advertisementController.getAdvertisementCount);

// Get all unapproved advertisements for admin
router.get('/admin', advertisementController.getUnapprovedAdvertisements);

// Approve an advertisement
router.post('/admin/approve/:id', advertisementController.approveAdvertisement);

// Delete an advertisement
router.delete('/admin/:id', advertisementController.deleteAdvertisement);




// Get all approved advertisements for customers(kasun)
router.get('/', advertisementController.getApprovedAdvertisements);

module.exports = router;
