import Recommendation from "../models/Recommendation.js";
import aiService from "../services/aiService.js";

const createAIRecommendation = async (req, res) => {
  try {
    const { location, preferences } = req.body;

    if (
      !location || 
      !preferences || 
      preferences.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Location and preferences are required." });
    }

    const aiGeneratedText = await aiService.getRecommendations(location, preferences);

    const recommendation = new Recommendation({
      userId: req.body.userId,
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

export {createAIRecommendation};