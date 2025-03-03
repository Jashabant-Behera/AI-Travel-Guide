const Recommendation = require("../models/Recommendation");
const { getAIGeminiRecommendations } = require("../services/aiService");

// Controller for AI Travel Recommendations
const createAIRecommendation = async (req, res) => {
  try {
    const { location, preferences } = req.body;
    if (!location || !preferences || preferences.length === 0) {
      return res
        .status(400)
        .json({ error: "Location and preferences are required." });
    }

    const aiGeneratedText = await getAIGeminiRecommendations(
      location,
      preferences
    );

    // Truncate the description to 500 characters
    const truncatedDescription =
      aiGeneratedText.length > 500
        ? aiGeneratedText.substring(0, 500)
        : aiGeneratedText;

    const recommendation = new Recommendation({
      userId: req.user.id, // Ensure userId is set correctly
      category: "AI Generated",
      location,
      name: "AI Suggested Places",
      description: truncatedDescription,
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

module.exports = { createAIRecommendation };
