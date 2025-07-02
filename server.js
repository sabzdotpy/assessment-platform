import express from "express";
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

// Common Routes
import commonAuthRoutes from "./routes/common/auth.routes.js";

import authMiddleware from "./middlewares/auth.middleware.js";
import connectDB from "./database/mongodb.js";
import { PORT } from "./config/env.js";
import errorMiddleware from "./middlewares/handleError.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true,
}));


const APIV1 = "/api/v1";

// common routes (For both admin and trainer)
app.use(
  "/api/assessments",
  authMiddleware(["admin", "trainer"]),
  assessmentRoutes
);
app.use(`${APIV1}/sections`, authMiddleware(["admin", "trainer"]), sectionRoutes);
app.use(`${APIV1}/questions`, authMiddleware(["admin", "trainer"]), questionRoutes);

//candidate routes
app.use(`${APIV1}/candidate/assessments`, candidateAssessmentRoutes);
app.use(`${APIV1}/candidate/attempts`, authMiddleware(["candidate"]), candidateAttemptRoutes);

//admin routes
app.use(`${APIV1}/admin`, adminRoutes);

// Common Auth Routes
// * Note: currently only login/register routes are implemented, so no auth middleware is applied here.
// * if needed, apply middleware to certain routes in common/auth.routes.js
app.use(`${APIV1}/common/auth`, commonAuthRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Assessment Platform API is running");
});

app.use(errorMiddleware);

const startServer = async() => {
  try{
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    } catch(error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
}

startServer();

export default app;
