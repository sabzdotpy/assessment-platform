import { parseCSVBuffer } from "../../utils/csvParser.js";
import { bulkCreateCandidates } from "../../services/bulkUser.service.js";

export const addBulkUserFromCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }
    const users = await parseCSVBuffer(req.file.buffer); // Parse directly from memory buffer

    if (!Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "No valid users found in CSV" });
    }
    await bulkCreateCandidates(users);
    res.status(201).json({
      message: "Candidates created and credentials sent successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error processing CSV", error });
  }
};
