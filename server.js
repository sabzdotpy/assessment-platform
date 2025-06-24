import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";

// Import routes
//candidate routes imports
import candidateAssessmentRoutes from "./routes/candidate/assessment.delivery.routes.js";
import candidateAttemptRoutes from "./routes/candidate/attempt.routes.js";

//admin routes
import adminRoutes from "./routes/admin/admin.routes.js";

import assessmentRoutes from "./routes/assessment.routes.js";
import sectionRoutes from "./routes/section.routes.js";
import questionRoutes from "./routes/question.routes.js";

import User from "./models/user.model.js";
import authMiddleware from "./middlewares/auth.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Common Auth Routes (Register & Login)
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role });
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// common routes (For both admin and trainer)
app.use(
  "/api/assessments",
  authMiddleware(["admin", "trainer"]),
  assessmentRoutes
);
app.use("/api/sections", authMiddleware(["admin", "trainer"]), sectionRoutes);
app.use("/api/questions", authMiddleware(["admin", "trainer"]), questionRoutes);

//candidate routes
app.use("/api/v1/candidate/assessments", candidateAssessmentRoutes);
app.use("/api/v1/candidate/attempts", candidateAttemptRoutes);

//admin routes
app.use("/api/v1/admin", adminRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Assessment Platform API is running");
});

// MongoDB Connection & Server Start
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
