import { Router } from "express";
import { 
    createLocation, 
    getAllLocations, 
    getLocationById,
    updateLocation, 
    deleteLocation, 
    searchLocation 
} from "../controllers/locationController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = Router();

router.post("/create", verifyToken, createLocation);
router.get("/search", searchLocation);
router.get("/", getAllLocations);
router.get("/:id", getLocationById);
router.put("/:id", verifyToken, updateLocation);
router.delete("/:id", verifyToken, deleteLocation);


export default router;
