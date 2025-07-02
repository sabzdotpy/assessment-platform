import { z } from "zod";
import assessmentDifficulty from "../constants/enum/assessmentDifficulty.enum.js";

import { objectId } from "./common.js";

const assessmentValidationSchema = z.object({
  title: z.string(),
  description: z.string(),
  duration: z.number().positive(),
  difficulty: z.enum(Object.values(assessmentDifficulty)),
  proctoringOptions: z
    .object({
      tabSwitchLimit: z.number().nonnegative(),
      cameraEnabled: z.boolean(),
    })
    .optional(),
  sections: z.array(objectId),
  assignedTo: z.array(objectId),
  // startTime: z.date().optional(),
  // endTime: z.date().optional(),
  createdBy: objectId,
  isPublished: z.boolean().optional(),
});

export default assessmentValidationSchema;