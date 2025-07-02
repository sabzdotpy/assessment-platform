import { parseCSVBuffer } from "../../utils/csvParser.js";
import { bulkCreateCandidates } from "../../services/bulkUser.service.js";

import Response from "../../utils/generateResponse.js";
import { HTTP_STATUS } from "../../constants/enum/responseCodes.enum.js";

export const addBulkUserFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "CSV file is required.");
    }
    const users = await parseCSVBuffer(req.file.buffer); // Parse directly from memory buffer

    
    if (!Array.isArray(users) || users.length === 0) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "No valid users found in CSV.");
    }
    await bulkCreateCandidates(users);
    return Response.success(res, HTTP_STATUS.CREATED, "Bulk users added from CSV.", users);
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};
