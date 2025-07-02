import AssessmentAttempt from "../../../models/assessmentAttempt.model";

import Response from "../../../utils/generateResponse";

//yet to add routes for this controller
export const getAttemptByCandidate = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({
      candidateId: req.params.candidateId,
    });
    // res.json(attempts);
    return Response.success(res, 200, "Retrieved attempts by candidate.", attempts);
  } catch (error) {
    // res.status(500).json({ message: error.message });
    return Response.error(res, 500, "Error getting attempts by candidate.", error);
  }
};
