import express from 'express';
import {
  createAssessment,
  getAllAssessments,
  publishAssessment,
  getAssessmentById
} from '../controllers/assessment.controller.js';

const router = express.Router();

router.post('/', createAssessment);
router.get('/', getAllAssessments);
router.get('/:id', getAssessmentById);
router.patch('/:id/update-publish-status', publishAssessment);

export default router;