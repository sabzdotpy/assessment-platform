import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  selectedOptions: [String],
  isCorrect: Boolean,
  obtainedMarks: Number,
});

const assessmentAttemptSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  answers: [answerSchema],
  totalScore: Number,
  sectionScores: Map,
  status: { type: String, enum: ['IN_PROGRESS', 'SUBMITTED', 'EVALUATED'], default: 'IN_PROGRESS' },
  startedAt: Date,
  submittedAt: Date,
}, { timestamps: true });

export default mongoose.model('AssessmentAttempt', assessmentAttemptSchema);