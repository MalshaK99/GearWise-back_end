const Product = require("../models/product"); // Ensure the correct path to your Product model


// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

// Get products by supplier name
exports.getProductsBySupplierName = async (req, res) => {
    const { s_name } = req.query; 

    try {
        const products = await Product.find({ supplier: s_name });

        if (products.length > 0) {
            res.status(200).json(products);
        } else {
            res.status(404).json({ message: "No products found for the specified supplier." });
        }
    } catch (error) {
        console.error('Error fetching products by supplier name:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
    const _id = req.params.id;

    try {
        const product = await Product.findById(_id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
exports.getProductBySupplier = async (req, res) => {
    const supplierId = req.params.supplierId;

    // Check if supplierId is undefined or null
    if (!supplierId) {
        return res.status(400).json({ message: 'Supplier ID is missing' });
    }

    try {
        // Find the product associated with the given supplier ID
        const product = await Product.findOne({ s_name: supplierId });

        if (!product) {
            return res.status(404).json({ message: 'Product not found for the given supplier ID' });
        }

        // Return the product ID in the response
        res.status(200).json({ productId: product._id });
    } catch (error) {
        console.error('Error fetching product by supplier:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Update product details by product ID
exports.updateProductById = async (req, res) => {
    const productId = req.params.id;
    const { s_name, quantity, price, date } = req.body;

    try {
        // Find the product by ID and update its details
        const product = await Product.findByIdAndUpdate(
            productId,
            { owner: s_name, quantity, price, serviceDate: date },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
