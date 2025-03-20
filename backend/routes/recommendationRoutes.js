import { Router } from "express";
const router = Router();
import verifyToken from "../middleware/authMiddleware.js";
import { createAIRecommendation } from "../controllers/recommendationController.js";

router.post("/ai", verifyToken, createAIRecommendation);

export default router;
