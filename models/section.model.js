import mongoose from "mongoose";
import sectionType from "../constants/enum/sectionType.enum.js";

const sectionSchema = new mongoose.Schema(
  {
    title: String,
    order: Number,
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    type: { type: String, enum: Object.values(sectionType) },
    assessmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Assessment" },
  },
  { timestamps: true }
);

export default mongoose.model("Section", sectionSchema);
