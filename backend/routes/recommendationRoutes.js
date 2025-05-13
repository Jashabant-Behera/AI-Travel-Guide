import { Router } from "express";
const router = Router();
import verifyToken from "../middleware/authMiddleware.js";
import { createAIRecommendation, getUserRecommendations, deleteRecommendation } from "../controllers/recommendationController.js";

router.post("/ai", verifyToken, createAIRecommendation);
router.get("/user", verifyToken, getUserRecommendations);
router.delete('/:id', verifyToken, deleteRecommendation);

export default router;
