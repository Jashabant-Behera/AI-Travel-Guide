const Itinerary = require("../module/Itinerary");
const { generateAIItinerary } = require("../services/aiService"); 

// Controller for AI Itinerary
const createAIItinerary = async (req, res) => {
  try {
    const { location, preferences, days } = req.body;

    if (!location || !preferences || !Array.isArray(preferences) || preferences.length === 0) {

      return res
        .status(400)
        .json({
          error: "Location, preferences, and number of days are required",
        });
    }

    const aiGeneratedText = await generateAIItinerary(location, preferences, days); // Uncomment if needed

    const itinerary = new Itinerary({
      user: req.user.id,
      location,
      days,
      details: aiGeneratedText,
    });

    await itinerary.save();
    res.status(201).json({
      message: "Itinerary created successfully.",
      itinerary,
      timestamp: new Date(),
    });

  } catch (error) {
    console.error("Error generating AI itinerary:", error);
    res.status(500).json({ error: "Failed to generate itinerary." });
  }
};

module.exports = { createAIItinerary };
