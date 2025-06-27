import { z } from "zod";
import questionAttemptStatus from "../constants/enum/questionAttemptStatus.enum.js";
import assessmentAttemptStatus from "../constants/enum/assessmentAttemptStatus.enum.js";

import { objectId } from "./common.js";

const answerSchema = z.object({
  questionId: objectId,
  selectedOptions: z.array(z.string()),
  isCorrect: z.boolean().optional(),
  status: z.enum(Object.values(questionAttemptStatus)).optional(),
  obtainedMarks: z.number().optional(),
});

const assessmentAttemptValidationSchema = z.object({
  candidateId: objectId,
  assessmentId: objectId,
  answers: z.array(answerSchema),
  totalScore: z.number().optional(),
  sectionScores: z.record(z.number()).optional(),
  status: z.enum(Object.values(assessmentAttemptStatus)).optional(),
  startedAt: z.date().optional(),
  submittedAt: z.date().optional(),
});

export default assessmentAttemptValidationSchema;