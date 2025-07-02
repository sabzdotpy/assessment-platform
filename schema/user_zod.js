import { z } from "zod";

import userRole from "../constants/enum/userRole.enum.js";
import objectId from "./common.js";

const userValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(Object.values(userRole)),
  groupId: objectId.optional(),
});

export default userValidationSchema;