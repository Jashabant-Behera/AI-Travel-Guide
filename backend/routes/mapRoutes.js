import { Router } from 'express';
const router = Router();
import searchNearby from '../controllers/mapController.js';

router.get('/searchNearby', searchNearby);

export default router;
