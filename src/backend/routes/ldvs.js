import express from 'express';
import { calculateLDVS, getHistory } from '../controllers/ldvsController.js';

const router = express.Router();

router.post('/calculate', calculateLDVS);
router.get('/:sme_id/history', getHistory);

export default router;
