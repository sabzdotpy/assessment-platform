import { parseCSVBuffer } from "../../utils/csvParser.js";
import { bulkCreateCandidates } from "../../services/bulkUser.service.js";

import Response from "../../utils/generateResponse.js";
import { HTTP_STATUS } from "../../constants/enum/responseCodes.enum.js";

export const addBulkUserFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      // return res.status(400).json({ message: "CSV file is required" });
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "CSV file is required.");
    }
    const users = await parseCSVBuffer(req.file.buffer); // Parse directly from memory buffer

    
    if (!Array.isArray(users) || users.length === 0) {
      // return res.status(400).json({ message: "No valid users found in CSV" });
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "No valid users found in CSV.");
    }
    await bulkCreateCandidates(users);
    // res.status(201).json({
    //   message: "Candidates created and credentials sent successfully.",
    // });
    return Response.success(res, HTTP_STATUS.CREATED, "Bulk users added from CSV.", users);
  } catch (error) {
    // console.error(error);
    // res.status(500).json({ message: "Error processing CSV", error });
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, "Error processing CSV", error);
  }
};
