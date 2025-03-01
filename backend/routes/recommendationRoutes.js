const express = require("express");
const Recommendation = require("../module/Recommendation");
const { verifyToken } = require("../middleware/auth");
const {
  createAIRecommendation,
} = require("../controllers/recommendationController");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const { category, location } = req.query;
    if (!category || !location) {
      return res
        .status(400)
        .json({ message: "Category and location are required!" });
    }

    const recommendations = await Recommendation.find({ category, location });
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { category, location, name, description, rating } = req.body;
    if (!category || !location || !name) {
      return res.status(400).json({ message: "Missing required fields!" });
    }

    const newRecommendation = new Recommendation({
      userId: req.user.id,
      category,
      location,
      name,
      description,
      rating,
    });

    await newRecommendation.save();
    res.status(201).json({
      message: "Recommendation added successfully",
      recommendation: newRecommendation,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding recommendation", error: error.message });
  }
});

router.get("/personalized", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await Recommendation.find({ user: userId });

    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching personalized recommendations",
      error: error.message,
    });
  }
});

router.post("/ai", verifyToken, createAIRecommendation);

module.exports = router;
