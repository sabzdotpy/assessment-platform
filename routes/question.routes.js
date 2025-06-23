import express from 'express';
import {
  addQuestion,
  getQuestionsBySection
} from '../controllers/question.controller.js';

const router = express.Router();

//create a route for bulk questions add eg: [questions] all at once
// router.post('/bulk-question', {})

router.post('/', addQuestion);
router.get('/section/:sectionId', getQuestionsBySection);

export default router;