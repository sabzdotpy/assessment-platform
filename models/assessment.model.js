import mongoose from "mongoose";
import assessmentDifficulty from "../constants/enum/assessmentDifficulty.enum.js";

const assessmentSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    duration: Number,
    difficulty: { type: String, enum: Object.values(assessmentDifficulty) },
    proctoringOptions: {
      tabSwitchLimit: Number,
      cameraEnabled: Boolean,
    },
    sections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Section" }],
    // assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    isPublished: { type: Boolean, default: false },
    startTime: Date,
    endTime: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);
