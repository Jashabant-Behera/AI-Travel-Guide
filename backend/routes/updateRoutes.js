import express from "express";
import { updateUser } from "../controllers/updateController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/update", verifyToken, updateUser);

export default router;
