import mongoose from "mongoose";
import sectionType from "../constants/enum/sectionType.enum.js";
import assessmentDifficulty from "../constants/enum/assessmentDifficulty.enum.js";

const questionSchema = new mongoose.Schema(
  {
    questionText: String,
    questionImage: String, // for pseudo code
    type: { type: String, enum: sectionType.MCQ },
    options: [String],
    correctAnswers: [String],
    difficulty: { type: String, enum: Object.values(assessmentDifficulty) },
    explanation: String,
    marks: Number,
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
