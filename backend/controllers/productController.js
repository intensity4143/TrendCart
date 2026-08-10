const Product = require("../models/ProductModel");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const redis = require("../config/redis");
const { stringify } = require("querystring");

// controller for adding product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      detailedDescription,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    const image1 = req.files?.image1?.[0] || null;
    const image2 = req.files?.image2?.[0] || null;
    const image3 = req.files?.image3?.[0] || null;
    const image4 = req.files?.image4?.[0] || null;

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== null,
    );

    // uploading images on cloudinary
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
          folder: "TrendCart",
        });

        // remove local file after upload
        fs.unlinkSync(item.path);

        return result.secure_url;
      }),
    );

    // creating entry in database
    const product = await Product.create({
      name,
      description,
      detailedDescription: detailedDescription || '',
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    });

    // invalidating cache
    await redis.del("products:all");

    res.status(201).json({
      success: true,
      message: "product added",
    });
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller for listing product
const listProducts = async (req, res) => {
    try {
        const cachedProducts = await redis.get("products:all");

        // Cache HIT
        if (cachedProducts) {
            return res.json({
                success: true,
                products: JSON.parse(cachedProducts)
            });
        }

        // Cache MISS
        const products = await Product.find({});

        await redis.set(
            "products:all",
            JSON.stringify(products),
            "EX",
            600
        );

        return res.json({
            success: true,
            products,
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// controller for removing product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Invalidate Redis cache
        const cacheKey = `products:${id}`;

        await redis.del(cacheKey);
        await redis.del("products:all");

        return res.status(200).json({
            success: true,
            message: "Product removed",
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// controller for single product info
const singleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const cacheKey = `products:${id}`;
        const cachedProduct = await redis.get(cacheKey);

        // Cache HIT
        if (cachedProduct) {
            return res.status(200).json({
                success: true,
                product: JSON.parse(cachedProduct)
            });
        }

        // Cache MISS
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found!"
            });
        }

        await redis.set(
            cacheKey,
            JSON.stringify(product),
            "EX",
            1200
        );

        return res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// controller for updating product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, detailedDescription, price, category, subCategory, sizes, bestseller } = req.body;

    const updateData = {
      name,
      description,
      detailedDescription: detailedDescription || '',
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === 'true',
      sizes: JSON.parse(sizes),
    };

    const newImages = ['image1','image2','image3','image4']
      .map(f => req.files?.[f]?.[0] || null)
      .filter(Boolean);

    if (newImages.length > 0) {
      updateData.image = await Promise.all(
        newImages.map(async (item) => {
          const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image', folder: 'TrendCart' });
          fs.unlinkSync(item.path);
          return result.secure_url;
        })
      );
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found' });

    await redis.del(`products:${id}`);
    await redis.del('products:all');

    res.json({ success: true, message: 'Product updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addProduct,
  listProducts,
  removeProduct,
  singleProduct,
  updateProduct,
};
