import AssessmentAttempt from "../../../models/assessmentAttempt.model";

import Response from "../../../utils/generateResponse";

//yet to add routes for this controller
export const getAttemptByCandidate = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({
      candidateId: req.params.candidateId,
    });
    return Response.success(res, 200, "Retrieved attempts by candidate.", { attempts });
  } catch (error) {
    return Response.error(res, 500, error.message, error);
  }
};
