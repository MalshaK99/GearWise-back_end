// routes/productRoutes.js

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Create a new product
router.post("/products", productController.createProduct);

// Get all products
router.get("/products", productController.getAllProducts);

// Get a product by ID
router.get("/products/:id", productController.getProductById);

// Update a product by ID
router.patch("/products/:id", productController.updateProductById);

// Delete a product by ID
router.delete("/products/:id", productController.deleteProductById);

module.exports = router;
