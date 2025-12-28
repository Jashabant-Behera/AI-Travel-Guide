import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
import { AppError } from "../middleware/errorHandler.js";

config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Trying gemini-pro as a fallback for stability
const MODEL_NAME = "gemini-pro"; 

const getRecommendations = async (location, preferences) => {
  try {
    console.log("REQ DATA Recommend (Gemini):", { location, preferences });

    if (!location || !preferences) {
      throw new AppError("Location and preferences are required", 400);
    }

    const preferencesText = Array.isArray(preferences) && preferences.length
      ? preferences.join(", ")
      : String(preferences || "general travel");

    const prompt = `
Act as a travel guide.
Provide short bullet-point recommendations for ${location}.
Preferences: ${preferencesText}.
Include:
- Local food
- Cultural sites
- Hidden / lesser-known places
`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);

    if (!result?.response?.candidates?.length) {
       throw new AppError("Gemini returned no candidates (Safety/Blocked)", 502);
    }

    let text;
    try {
      text = result.response.text();
    } catch (e) {
      throw new AppError("Gemini returned empty/blocked content", 502);
    }

    if (!text) {
      throw new AppError("No response text from AI service", 500);
    }

    return text;
  } catch (error) {
    console.error("Gemini Recommendation Error:", error);

    if (error.message?.includes("API key")) {
      throw new AppError("AI service configuration error", 500);
    }

    if (error.message?.includes("quota") || error.message?.includes("429")) {
      throw new AppError("AI service quota exceeded. Please try again later", 503);
    }

    if(error.message?.includes("not supported for the requested API version")) {
        throw new AppError("AI Model/Location not supported. Please check region settings.", 503);
    }

    if (error instanceof AppError) throw error;

    throw new AppError(
      `Failed to generate recommendations: ${error.message}`,
      500
    );
  }
};

const generateItinerary = async (location, preferences, days) => {
  try {
    console.log("REQ DATA Itinerary (Gemini):", { location, preferences, days });

    if (!location || !preferences || !days) {
      throw new AppError("Location, preferences, and days are required", 400);
    }

    const preferencesText = Array.isArray(preferences) && preferences.length
      ? preferences.join(", ")
      : String(preferences || "general travel");

    const prompt = `
Create a detailed ${days}-day travel itinerary for ${location}.
Interests: ${preferencesText}

For EACH day include:
- Morning
- Afternoon
- Evening
Keep it practical and realistic.
`;

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent(prompt);
    
    if (!result?.response?.candidates?.length) {
       throw new AppError("Gemini returned no candidates (Safety/Blocked)", 502);
    }

    let text;
    try {
      text = result.response.text();
    } catch (e) {
      throw new AppError("Gemini returned empty/blocked content", 502);
    }

    if (!text) {
      throw new AppError("No response text from AI service", 500);
    }

    return text;
  } catch (error) {
    console.error("Gemini Itinerary Error:", error);

    if (error.message?.includes("API key")) {
      throw new AppError("AI service configuration error", 500);
    }

    if (error.message?.includes("quota") || error.message?.includes("429")) {
      throw new AppError("AI service quota exceeded. Please try again later", 503);
    }
    
    if (error instanceof AppError) throw error;

    throw new AppError(
      `Failed to generate itinerary: ${error.message}`,
      500
    );
  }
};

export default {
  getRecommendations,
  generateItinerary,
};
