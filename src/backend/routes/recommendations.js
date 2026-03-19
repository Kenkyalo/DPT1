import express from 'express';
import { generateRecommendations, getLatestRecommendations, translateRecommendations } from '../controllers/recommendationsController.js';

const router = express.Router();

router.post('/generate', generateRecommendations);
router.get('/:sme_id', getLatestRecommendations);
router.post('/translate', translateRecommendations);

export default router;
