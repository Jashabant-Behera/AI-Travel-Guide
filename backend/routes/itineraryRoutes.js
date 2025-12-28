import { Router } from "express";
const router = Router();
import verifyToken from "../middleware/authMiddleware.js";
import { 
    createAIItinerary, 
    getAllItineraries, 
    getItineraryById, 
    updateItinerary, 
    deleteItinerary, 
    publicItinerary, 
    getPublicItineraryByToken,
    exportItinerary
 } from "../controllers/itineraryController.js";

router.post("/create", verifyToken, createAIItinerary);
router.get("/", verifyToken, getAllItineraries);
router.get("/export/:id", exportItinerary);
router.get("/share/:token", getPublicItineraryByToken);
router.get("/:id", verifyToken, getItineraryById);
router.put("/:id", verifyToken, updateItinerary);
router.delete("/:id", verifyToken, deleteItinerary);
router.patch("/public/:id", verifyToken, publicItinerary);

export default router;
