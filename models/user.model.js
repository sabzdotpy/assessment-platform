import mongoose from "mongoose";
import userRole from "../constants/enum/userRole.enum.js";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: Object.values(userRole), required: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
