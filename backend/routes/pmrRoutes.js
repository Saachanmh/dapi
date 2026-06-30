import express from 'express';
import { getPMRLocations, getPMRById, syncPMRData, getCommunes } from '../controllers/pmrController.js';

const router = express.Router();

router.get('/emplacements', getPMRLocations);
router.get('/emplacements/:id', getPMRById);
router.get('/communes', getCommunes);
router.post('/sync', syncPMRData);

export default router;
