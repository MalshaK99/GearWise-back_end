const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Create a new product
router.post("/products", async (req, res) => {
    console.log(req.body);
    const product = new Product(req.body);

    try {
        await product.save();
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get all products
router.get("/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Get a product by ID
router.get("/products/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).send();
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update a product by ID
router.patch("/products/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(_id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).send();
        }
        res.status(200).send(updatedProduct);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete a product by ID
router.delete("/products/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const deletedProduct = await Product.findByIdAndDelete(_id);
        if (!deletedProduct) {
            return res.status(404).send();
        }
        res.status(200).send(deletedProduct);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
