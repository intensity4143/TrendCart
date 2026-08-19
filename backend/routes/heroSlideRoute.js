const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer");

const {
    getActiveSlides,
    getAllSlides,
    createSlide,
    updateSlide,
    deleteSlide,
} = require("../controllers/HeroSlideController");

const adminAuth = require("../middleware/adminAuth");
const rateLimiter = require("../middleware/redisAuth");


// Public
router.get(
    "/hero-slides",
    rateLimiter(60, 60),
    getActiveSlides
);


// Admin
router.get(
    "/hero-slides",
    rateLimiter(30, 60),
    adminAuth,
    getAllSlides
);

router.post(
    "/hero-slides",
    rateLimiter(5, 60),
    adminAuth,
    upload.single("image"),
    createSlide
);

router.put(
    "/hero-slides/:id",
    rateLimiter(5, 60),
    adminAuth,
    upload.single("image"),
    updateSlide
);

router.delete(
    "/hero-slides/:id",
    rateLimiter(10, 60),
    adminAuth,
    deleteSlide
);


module.exports = router;