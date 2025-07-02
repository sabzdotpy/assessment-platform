import { z } from "zod";

import sectionType from "../constants/enum/sectionType.enum.js";
import { objectId } from "./common.js";

const sectionValidationSchema = z.object({
    title: z.string(),
    order: z.number(),
    questionIds: z.array(objectId),
    type: z.enum(Object.values(sectionType)),
    assessmentId: objectId,
})

export default sectionValidationSchema;