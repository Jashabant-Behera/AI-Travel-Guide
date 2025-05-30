import { Router } from "express";
const router = Router();
import { getRecommendation } from "../controllers/recommendationController.js";

router.post("/", getRecommendation);

export default router;
