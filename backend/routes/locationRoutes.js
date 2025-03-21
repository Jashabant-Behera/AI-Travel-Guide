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

router.get("/search", searchLocation);
router.get("/:id", getLocationById);

router.post("/create", verifyToken, createLocation);

router.get("/", getAllLocations);
router.put("/:id", verifyToken, updateLocation);
router.delete("/:id", verifyToken, deleteLocation);


export default router;
