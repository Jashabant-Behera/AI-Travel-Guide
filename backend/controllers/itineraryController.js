const Itinerary = require("../models/Itinerary");
const { generateAIGeminiItinerary } = require("../services/aiService");

// Controller for AI Itinerary
const createAIItinerary = async (req, res) => {
  try {
    const { location, preferences, days, dates } = req.body;

    if (!location || !preferences || !Array.isArray(preferences) || preferences.length === 0 || !dates || !dates.start || !dates.end) {
      return res
        .status(400)
        .json({ error: "Location, preferences, dates, and number of days are required" });
    }

    const aiGeneratedText = await generateAIGeminiItinerary(location, preferences, days);

    const itinerary = new Itinerary({
      user: req.user.id,
      location,
      days,
      dates,
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
