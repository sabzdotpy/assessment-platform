import express from 'express';
import {
  startAttempt,
  submitAttempt,
  getAttemptById,
  getMyAttempts
} from '../../controllers/attempt.controller.js';

const router = express.Router();

/**
 * @route   POST /api/v1/candidate/attempts/start/:assessmentId
 * @desc    Used to create an actual attempt entry in the database
 *          Tracks when the candidate officially begins the assessment
 */
router.post('/start/:assessmentId', startAttempt);

/**
 * @route   POST /api/v1/candidate/attempts/start/:assessmentId
 * @desc    Submit and evaluate
 */
router.post('/submit/:attemptId', submitAttempt);

/**
 * @route   GET /api/v1/candidate/attempts/start/:assessmentId
 * @desc    View all attempts made by the current candidate
 */
router.get('/my-attempts', getMyAttempts);

/**
 * @route   GET /api/v1/candidate/attempts/start/:assessmentId
 * @desc    View all attempts made by the current candidate
 */
router.get('/:attemptId', getAttemptById);




export default router;