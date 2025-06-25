import mongoose from "mongoose";
import questionAttemptStatus from "../constants/enum/questionAttemptStatus.enum.js";
import assessmentAttemptStatus from "../constants/enum/assessmentAttemptStatus.enum.js";
import userRole from "../constants/enum/userRole.enum.js";
import User from "./user.model.js";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  selectedOptions: [String],
  isCorrect: {
    type: Boolean,
    default: false,
  },
  //each answers should have items like attended, not attended, mark for review etc...
  status: {
    type: String,
    enum: Object.values(questionAttemptStatus),
    default: questionAttemptStatus.NOT_ATTENDED,
  },
  obtainedMarks: Number,
});

const assessmentAttemptSchema = new mongoose.Schema(
  {
    candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },
    answers: [answerSchema],
    totalScore: Number,
    sectionScores: Map,
    status: {
      type: String,
      enum: Object.values(assessmentAttemptStatus),
      default: assessmentAttemptStatus.IN_PROGRESS,
    },
    startedAt: Date,
    submittedAt: Date,
  },
  { timestamps: true }
);

// Middleware to enforce only candidate to attend the test
assessmentAttemptSchema.pre("save", async function (next) {
  const creator = await User.findById(this.candidateId);
  console.log(creator);
  if (!creator || !(creator.role === userRole.CANDIDATE)) {
    const err = new Error("Only candidate can attend the assessments.");
    err.statusCode = 403;
    return next(err);
  }
  next();
});

const AssessmentAttempt = mongoose.model(
  "AssessmentAttempt",
  assessmentAttemptSchema
);
export default AssessmentAttempt;
