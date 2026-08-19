const express = require('express');
const productRouter = express.Router();

const {
    addProduct,
    listProducts,
    removeProduct,
    singleProduct,
    updateProduct
} = require('../controllers/productController');

const upload = require('../middleware/multer');
const adminAuth = require('../middleware/adminAuth');
const rateLimiter = require('../middleware/redisAuth');


// Add product - Admin only
productRouter.post(
    '/add',
    rateLimiter(5, 60),
    adminAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    addProduct
);


// Get all products - Public
productRouter.get(
    '/list',
    rateLimiter(60, 60),
    listProducts
);


// Get single product - Public
productRouter.get(
    '/single/:id',
    rateLimiter(100, 60),
    singleProduct
);


// Update product - Admin only
productRouter.put(
    '/update/:id',
    rateLimiter(5, 60),
    adminAuth,
    upload.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 },
        { name: 'image4', maxCount: 1 }
    ]),
    updateProduct
);


// Delete product - Admin only
productRouter.delete(
    '/remove/:id',
    rateLimiter(5, 60),
    adminAuth,
    removeProduct
);


module.exports = productRouter;