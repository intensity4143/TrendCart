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

// add product
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// get all products
productRouter.get('/list', listProducts);

// get single product
productRouter.get('/single/:id', singleProduct);

// update product
productRouter.put(
  '/update/:id',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  updateProduct
);

// delete product
productRouter.delete('/remove/:id', adminAuth, removeProduct);

module.exports = productRouter;