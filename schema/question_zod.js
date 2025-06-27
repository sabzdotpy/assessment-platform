import { z } from "zod";
import sectionType from "../constants/enum/sectionType.enum.js";
import assessmentDifficulty from "../constants/enum/assessmentDifficulty.enum.js";

import { objectId } from "./common.js";

const questionValidationSchema = z.object({
  questionText: z.string(),
  questionImage: z.string().optional(),
  type: z.literal(sectionType.MCQ),
  options: z.array(z.string()),
  correctAnswers: z.array(z.string()),
  difficulty: z.enum(Object.values(assessmentDifficulty)),
  explanation: z.string().optional(),
  marks: z.number().nonnegative(),
  sectionId: objectId,
});

export default questionValidationSchema;