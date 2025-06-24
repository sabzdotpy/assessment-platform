import mongoose from "mongoose";
import assessmentDifficulty from "../constants/enum/assessmentDifficulty.enum.js";
import userRole from "../constants/enum/userRole.enum.js";

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
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    startTime: Date,
    endTime: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);


// Middleware to enforce createdBy is admin and trainer
assessmentSchema.pre('save', async function (next) {
  const creator = await User.findById(this.createdBy);
  if (!creator || creator.role !== userRole.ADMIN || creator.role != userRole.TRAINER) {
    const err = new Error('Only admins can create assessments.');
    err.statusCode = 403;
    return next(err);
  }
  next();
});
export default mongoose.model("Assessment", assessmentSchema);
