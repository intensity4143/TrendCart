const cloudinary = require("cloudinary").v2;
const HeroSlide = require("../models/HeroModel");
const redis = require("../config/redis");

// PUBLIC — frontend carousel
const getActiveSlides = async (req, res) => {
  try {
    const cachedSlides = await redis.get("slides:all");
    if (cachedSlides) {
      return res.json({
        slides: JSON.parse(cachedSlides),
      });
    }

    const slides = await HeroSlide.find({ active: true }).sort({ order: 1 });
    await redis.set("slides:all", JSON.stringify(slides), "EX", 3600);
    res.json({ slides });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch slides" });
  }
};

// ADMIN — all slides
const getAllSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find().sort({ order: 1 });
    res.json({ slides });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch slides" });
  }
};

// ADMIN — create
const createSlide = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "hero-slides",
    });

    const {
      eyebrow,
      heading,
      subheading,
      bgColor,
      textColor,
      ctaLabel,
      ctaUrl,
      order,
      active,
    } = req.body;

    const slide = await HeroSlide.create({
      eyebrow,
      heading,
      subheading,
      image: result.secure_url,
      bgColor,
      textColor,
      cta: { label: ctaLabel, url: ctaUrl },
      order: order || 0,
      active: active !== "false",
    });

    await redis.del("slides:all");
    res.status(201).json({ slide });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create slide", error: err.message });
  }
};

// ADMIN — update
const updateSlide = async (req, res) => {
  try {
    const {
      eyebrow,
      heading,
      subheading,
      bgColor,
      textColor,
      ctaLabel,
      ctaUrl,
      order,
      active,
    } = req.body;

    const updates = {
      eyebrow,
      heading,
      subheading,
      bgColor,
      textColor,
      cta: { label: ctaLabel, url: ctaUrl },
      order,
      active: active !== "false",
    };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "hero-slides",
      });
      updates.image = result.secure_url;
    }

    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    await redis.del("slides:all");
    res.json({ slide });
  } catch (err) {
    res.status(500).json({ message: "Failed to update slide" });
  }
};

// ADMIN — delete
const deleteSlide = async (req, res) => {
  try {
    await HeroSlide.findByIdAndDelete(req.params.id);
    await redis.del("slides:all");
    res.json({ message: "Slide deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete slide" });
  }
};

module.exports = {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};
