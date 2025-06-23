import AssessmentAttempt from '../models/assessmentAttempt.model.js';
import Question from '../models/question.model.js';

export const startAttempt = async (req, res) => {
  try {
    const attempt = await AssessmentAttempt.create({
      candidateId: req.body.candidateId,
      assessmentId: req.params.assessmentId,
      startedAt: new Date(),
    });
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAttempt = async (req, res) => {
  try {
    const { answers } = req.body;
    let totalScore = 0;

    for (const answer of answers) {
      const question = await Question.findById(answer.questionId);
      answer.isCorrect = JSON.stringify(answer.selectedOptions.sort()) === JSON.stringify(question.correctAnswers.sort());
      answer.obtainedMarks = answer.isCorrect ? question.marks : 0;
      totalScore += answer.obtainedMarks;
    }

    const updatedAttempt = await AssessmentAttempt.findByIdAndUpdate(
      req.params.attemptId,
      {
        answers,
        totalScore,
        submittedAt: new Date(),
        status: 'SUBMITTED',
      },
      { new: true }
    );

    res.json(updatedAttempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttemptByCandidate = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({ candidateId: req.params.candidateId });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttemptById = async (req, res) => {
  try {
    const attempt = await AssessmentAttempt.findById(req.params.attemptId);
    res.json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
