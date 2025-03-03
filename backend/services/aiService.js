const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate Travel Recommendations based on user preferences
const getAIGeminiRecommendations = async (location, preferences) => {
  try {
    const prompt = `Generate travel recommendations for ${location} based on the following preferences: ${preferences.join(
      ", "
    )}. Include local food, cultural sites, and hidden places.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error Generating AI Recommendations:", error);
    throw new Error("Failed to generate recommendations");
  }
};

// Generate Itinerary based on user input
const generateAIGeminiItinerary = async (location, preferences, days) => {
  try {
    const prompt = `Create a ${days}-day itinerary for ${location} based on these interests: ${preferences.join(
      ", "
    )}. Include morning, afternoon, and evening activities.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error Generating AI Itinerary:", error);
    throw new Error("Failed to generate itinerary.");
  }
};

module.exports = { getAIGeminiRecommendations, generateAIGeminiItinerary };
