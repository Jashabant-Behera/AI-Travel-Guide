import express from "express";
import chatWithTravelBuddy from "../controllers/chatbotController.js";

const router = express.Router();

router.post("/chat", chatWithTravelBuddy);

export default router;