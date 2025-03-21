import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "dotenv";
config();
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const getRecommendations = async (location, preferences) => {
  try {
    const prompt = `Act as a travel guide and provide recommendations in short & bullet points for ${location} based on the following preferences: ${preferences.join(
      ", "
    )}. Include local food, cultural sites, and hidden places.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error Generating AI Recommendations:", error);
    throw new Error("Failed to generate recommendations");
  }
};

const generateItinerary = async (location, preferences, days) => {
  try {
    const prompt = `Act as a travel guide and create a ${days}-day itinerary in short & bullet points for ${location} based on these interests: ${preferences.join(
      ", "
    )}. Include morning, afternoon, and evening activities.`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error Generating AI Itinerary:", error);
    throw new Error("Failed to generate itinerary.");
  }
};

const chatbotResponse = async (message) => {
  try {
    const prompt = `You are a helpful travel assistant. Provide travel recommendations as well as local attractions, answer questions, and help with itinerary planning. User: ${message}`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error Generating Chatbot Response:", error);
    throw new Error("Failed to generate chatbot response.");
  }
};

const generateLocationInfo = async (location) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Provide a brief description and specialties of ${location}.`,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating location info:", error);
    throw new Error("Failed to generate location information.");
  }
};

export default { getRecommendations, generateItinerary, chatbotResponse, generateLocationInfo };
