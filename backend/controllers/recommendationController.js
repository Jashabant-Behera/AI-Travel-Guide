import aiService from "../services/aiService.js";

const getRecommendation = async (req, res) => {
  try {
    const { location, preferences } = req.body;

    if (!location || !preferences || preferences.length === 0) {
      return res.status(400).json({ error: "Location and preferences are required." });
    }

    const recommendation = await aiService.getRecommendations(location, preferences);

    res.status(200).json({
      message: "Recommendation generated successfully.",
      recommendation,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error in AI recommendation:", error);
    res.status(500).json({
      error: "Failed to generate recommendations.",
      details: error.message,
    });
  }
};

export { getRecommendation };