import express from 'express';
import { getAvailableAssessments, getAssessmentForCandidate } from '../../controllers/candidate/assessment.delivery.controller.js';
import authMiddleware from '../../middlewares/auth.middleware.js';// Assume it extracts req.user and role check

const router = express.Router();

/**
 * @route   GET /api/assessments/available
 * @desc    Candidate: View all active & assigned assessments
 */
router.get('/available',authMiddleware(['candidate']), getAvailableAssessments);

/**
 * @route   GET /api/assessments/take/:assessmentId
 * @desc    Candidate: Start an assessment (only if assigned and not attempted)
 */
router.get('/take/:assessmentId',authMiddleware(['candidate']), getAssessmentForCandidate);

export default router;
