import assessmentAttemptStatus from "../constants/enum/assessmentAttemptStatus.enum.js";
import Assessment from "../models/assessment.model.js";
import AssessmentAttempt from "../models/assessmentAttempt.model.js";
import Question from "../models/question.model.js";

export const submitAttempt = async (req, res) => {
  const candidateId = req.user._id;
  const { attemptId } = req.params;
  const { answers } = req.body;

  try {
    const attempt = await AssessmentAttempt.findOne({
      _id: attemptId,
      candidateId,
      status: assessmentAttemptStatus.IN_PROGRESS,
    });
    if (!attempt) {
      return res
        .status(404)
        .json({ message: "Attempt not found or already submitted" });
    }

    // Gather all questionIds
    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Create a map for quick lookup
    const questionMap = new Map();
    questions.forEach((q) => questionMap.set(q._id.toString(), q));

    let totalScore = 0;
    const sectionScores = new Map();

    for (const answer of answers) {
      const question = questionMap.get(answer.questionId.toString());

      if (!question) continue;

      const normalize = (arr) =>
        (arr || []).map((opt) => opt.trim().toLowerCase()).sort();

      const selected = normalize(answer.selectedOptions);
      const correct = normalize(question.correctAnswers);

      // do we need to check case sensitivity
      const isCorrect = JSON.stringify(selected) === JSON.stringify(correct);
      const obtainedMarks = isCorrect ? question.marks : 0;

      // Assign evaluation details
      answer.isCorrect = isCorrect;
      answer.obtainedMarks = obtainedMarks;
      totalScore += obtainedMarks;

      // Mark status: attempt, not_attempted, review (if frontend sends)
      if (answer.markedForReview) {
        answer.status = questionAttemptStatus.MARKED_FOR_REVIEW;
      } else {
        answer.status =
          answer.selectedOptions && answer.selectedOptions.length > 0
            ? questionAttemptStatus.ATTEMPTED
            : questionAttemptStatus.NOT_ATTENDED;
      }

      // Track per-section score
      const sectionId = question.sectionId.toString();
      const current = sectionScores.get(sectionId) || 0;
      sectionScores.set(sectionId, current + obtainedMarks);
    }
    // Convert sectionScores to plain object
    const sectionScoreObj = Object.fromEntries(sectionScores);

    const updatedAttempt = await AssessmentAttempt.findByIdAndUpdate(
      attemptId,
      {
        answers,
        totalScore,
        sectionScores: sectionScoreObj,
        submittedAt: new Date(),
        status: assessmentAttemptStatus.SUBMITTED,
      },
      { new: true }
    );

    res.status(200).json(updatedAttempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const startAttempt = async (req, res) => {
  const candidateId = req.user._id;
  const assessmentId = req.params.assessmentId;
  
  //check for id is valid or not

  try {
     // Prevent duplicate attempt
    const existing = await AssessmentAttempt.findOne({
      candidateId,
      assessmentId,
    });

    if (existing) {
      return res.status(400).json({ message: "You have already started this assessment." });
    }
    
    // Validate assessment
    const now = new Date();
    const assessment = await Assessment.findOne({
      _id: assessmentId,
      isPublished: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    if (!assessment) {
      return res.status(404).json({ message: "Assessment is not available to attempt." });
    }


    const attempt = await AssessmentAttempt.create({
      candidateId,
      assessmentId,
      startedAt: new Date(),
    });
    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getMyAttempts = async (req, res) => {
  const candidateId = req.user.id;

  try {
    const attempts = await AssessmentAttempt.find({ candidateId })
      .populate({
        path: "assessmentId",
        select: "title duration startTime endTime",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ attempts });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch your attempts", error });
  }
};


export const getAttemptById = async (req, res) => {
  const candidateId = req.user.id;
  const { attemptId } = req.params;

  try {
    const attempt = await AssessmentAttempt.findOne({
      _id: attemptId,
      candidateId,
    })
      .populate({
        path: 'assessmentId',
        select: 'title duration',
      })
      .populate({
        path: 'answers.questionId',
        select: 'questionText options correctAnswers explanation',
      });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found or access denied' });
    }

    res.status(200).json({ attempt });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attempt result', error });
  }
};

