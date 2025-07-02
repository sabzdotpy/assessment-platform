import { z } from "zod";

import { objectId } from "./common.js";

const groupValidationSchema = z.object({
  name: z.string(),
  trainerId: objectId,
  members: z.array(objectId),
});

export default groupValidationSchema;