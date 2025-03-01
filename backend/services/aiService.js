const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate Travel Recommendations based on user preferences
const getAIRecommendations = async (location, preferences) => {
  try {
    const prompt = `Generate travel recommendations for ${location} based on the following preferences: ${preferences.join(
      ", "
    )}. Include local food, cultural sites, and hidden places.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 300,
      temperature: 0.7,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error Generating AI Recommendations:", error);
    throw new Error("Failed to generate recommendations");
  }
};

// Generate Itinerary based on user input
const generateAIItinerary = async (location, preferences, days) => {
  try {
    const prompt = `Create a ${days}-day itinerary for ${location} based on these interests: ${preferences.join(
      ", "
    )}. Include morning, afternoon, and evening activities.`;
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 500,
      temperature: 0.7,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error("Error Generating AI Itinerary:", error);
    throw new Error("Failed to generate itinerary.");
  }
};

module.exports = { getAIRecommendations, generateAIItinerary };
