import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: String,
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export default mongoose.model("Group", groupSchema);

//create a middleware to check the memebers and candidate only and trainerId contains only id that are trainers
 
