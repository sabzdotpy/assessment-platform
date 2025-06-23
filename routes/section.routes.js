import express from 'express';
import {
  createSection,
  getSectionsByAssessment
} from '../controllers/section.controller.js';

const router = express.Router();

router.post('/', createSection);
router.get('/assessment/:assessmentId', getSectionsByAssessment);

export default router;