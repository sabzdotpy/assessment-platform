import express from 'express';
import {
  startAttempt,
  submitAttempt,
  getAttemptByCandidate,
  getAttemptById
} from '../controllers/attempt.controller.js';

const router = express.Router();

// get all the questions from a asssements that is published


router.post('/start/:assessmentId', startAttempt);
router.post('/submit/:attemptId', submitAttempt);
router.get('/candidate/:candidateId', getAttemptByCandidate);
router.get('/:attemptId', getAttemptById);




export default router;