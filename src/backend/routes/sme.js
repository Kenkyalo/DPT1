import express from 'express';
import { getAllSMEs, getSMEById, createSME, updateSME } from '../controllers/smeController.js';

const router = express.Router();

router.get('/', getAllSMEs);
router.get('/:id', getSMEById);
router.post('/', createSME);
router.put('/:id', updateSME);

export default router;
