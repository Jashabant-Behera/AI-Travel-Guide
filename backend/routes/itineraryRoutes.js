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
    getPublicItinerary, 
    exportItinerary,
    getPublicItineraryByToken
 } from "../controllers/itineraryController.js";

router.post("/create", verifyToken, createAIItinerary);
router.get("/", verifyToken, getAllItineraries);
router.get("/:id", verifyToken, getItineraryById);
router.put("/:id", verifyToken, updateItinerary);
router.delete("/:id", verifyToken, deleteItinerary);
router.patch("/public/:id", verifyToken, publicItinerary);
router.get('/public/:token', getPublicItineraryByToken);
router.get("/share/:token", getPublicItinerary);
router.get("/export/:id", exportItinerary);



export default router;
