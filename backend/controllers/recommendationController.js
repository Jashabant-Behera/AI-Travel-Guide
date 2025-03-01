const Recommendation = require("../module/Recommendation");
const { getAIRecommendations } = require("../services/aiService");

// Controller for AI Travel Recommendations
const createAIRecommendation = async (req, res) => {
  try {
    const { category, location, name, description, rating, preferences } =
      req.body;
    if (!category || !location || !name || !rating || !preferences) {
      return res
        .status(400)
        .json({ error: "All fields including preferences are required." });
    }

    const aiGeneratedText = await getAIRecommendations(location, preferences);

    const recommendation = new Recommendation({
      userId: req.user.id,
      category,
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

module.exports = { createAIRecommendation };
