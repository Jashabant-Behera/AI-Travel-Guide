import Recommendation from "../models/Recommendation.js";
import aiService from "../services/aiService.js";

const createAIRecommendation = async (req, res) => {
  try {
    const { location, preferences } = req.body;
    const userId = req.userId;

    if (!location || !preferences || preferences.length === 0) {
      return res.status(400).json({ error: "Location and preferences are required." });
    }

    const aiGeneratedText = await aiService.getRecommendations(location, preferences);

    const recommendation = new Recommendation({
      userId,
      category: "AI Generated",
      location,
      name: "AI Suggested Places",
      description: aiGeneratedText,
      rating: 5,
    });

    await recommendation.save();
    res.status(201).json({
      message: "Recommendation created successfully.",
      recommendation,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error in AI recommendation:", error);
    res.status(500).json({
      error: "Failed to generate AI recommendations.",
      details: error.message,
    });
  }
};

const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.userId;

    if (req.user.id !== userId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const recommendations = await Recommendation.find({
      userId,
      category: "AI Generated",
    }).sort({ _id: -1 }); // newest first

    res.status(200).json({ recommendations });
  } catch (err) {
    console.error("Error fetching user recommendations:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export { createAIRecommendation, getUserRecommendations };
