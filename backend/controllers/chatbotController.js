import aiService from "../services/aiService.js";

const chatWithTravelBuddy = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Get the chatbot's response
    const reply = await aiService.chatbotResponse(message);

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Error in OpenAI chatbot:", error);
    res.status(500).json({ message: "Error communicating with the chatbot.", error: error.message });
  }
};

export default chatWithTravelBuddy;