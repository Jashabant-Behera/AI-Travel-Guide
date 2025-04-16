import { Router } from "express";
const router = Router();
import verifyToken from "../middleware/authMiddleware.js";
import { createAIRecommendation, getUserRecommendations } from "../controllers/recommendationController.js";

router.post("/ai", verifyToken, createAIRecommendation);
router.get("/user/:userId", verifyToken, getUserRecommendations);

export default router;
