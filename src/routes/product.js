const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

// Get all products
router.get("/", productController.getAllProducts);

// Get all products supplied by a specific customer (supplier)
router.get("/products-by-supplier", productController.getProductsBySupplierName); 

// Get a product by ID
router.get("/:id", productController.getProductById);

// Update a product by ID
router.patch("/:id", productController.updateProductById);

// Get product ID by supplier ID
router.get('/bySupplier/:supplierId', productController.getProductBySupplier);

module.exports = router;
