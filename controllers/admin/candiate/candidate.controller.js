import AssessmentAttempt from "../../../models/assessmentAttempt.model";

//yet to add routes for this controller
export const getAttemptByCandidate = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({
      candidateId: req.params.candidateId,
    });
    res.json(attempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
