//add redundant validations logic as a function here:
// like isValidObjectId ---> mongodb id

import mongoose from "mongoose";
import { z } from "zod";

class Validator {
  static objectID(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static email(email) {
    return z.string().email().safeParse(email).success;
  }

  static nonEmptyString(str) {
    return z.string().min(1).trim().safeParse(str).success;
  }

  static nonEmptyArray(arr) {
    return z.array(z.any()).nonempty().safeParse(arr).success;
  }

  // ! validates req.body against a zod schema, does not return boolean like other methods. handle exception when using.
  static schemaData(schema, data) {
    const parsedData = schema.safeParse(data);
    if (!parsedData.success) {
      throw new Error("Validation failed: " + JSON.stringify(parsedData.error.errors));
    }
    return parsedData.data;
  }

}

export default Validator;