import Assessment from "../../models/assessment.model.js";
import AssessmentAttempt from "../../models/assessmentAttempt.model.js";
import Group from "../../models/group.model.js"; // Needed for group membership resolution

import Response from "../../utils/generateResponse.js";

export const getAvailableAssessments = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const now = new Date();

    // Step 1: Find all group IDs where candidate is a member
    const candidateGroups = await Group.find({ members: candidateId }).select(
      "_id"
    );
    console.log(candidateGroups);

    const groupIds = candidateGroups.map((group) => group._id);

    console.log(groupIds);

    // Step 2: Find assessments assigned to any of those groups
    const assessments = await Assessment.find({
      isPublished: true,
      assignedTo: { $in: groupIds },
    }).select("title description duration startTime endTime");
    console.log(assessments);

    /**
     *  const assessments = await Assessment.find({
      isPublished: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
      assignedTo: { $in: groupIds },
    }).select('title description duration startTime endTime');
    console.log(assessments);
     */

    // res.status(200).json({ assessments });
    return Response.success(res, 200, "Successfully retrieved assessments.", assessments);
  } catch (error) {
    // res
    //   .status(500)
    //   .json({ message: "Failed to fetch available assessments", error });
    return Response.error(res, 500, "Failed to fetch available assessments.", error);
  }
};


//not working --> have to check
// 🔹 GET /api/assessments/take/:assessmentId
export const getAssessmentForCandidate = async (req, res) => {
  const candidateId = req.user.id;
  const { assessmentId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
    // return res.status(400).json({ message: "Invalid assessment ID" });
    return Response.error(res, 400, "Invalid assessment ID");
  }
  // const now = new Date();
  console.log(candidateId, assessmentId);

  try {
    // Step 1: Ensure the candidate has not already attempted this assessment
    const alreadyAttempted = await AssessmentAttempt.find({
      candidateId,
      assessmentId,
    });

    console.log(alreadyAttempted);

    if (alreadyAttempted) {
      // return res.status(403).json({
      //   message: "You have already attempted this assessment.",
      // });
      return Response.error(res, 403, "You have already attempted this assessment.");
    }

    // Step 2: Get group IDs for the candidate
    const candidateGroups = await Group.find({ members: candidateId }).select(
      "_id"
    );
    const groupIds = candidateGroups.map((group) => group._id);

    // Step 3: Find and populate the assessment (with access control)
    const assessment = await Assessment.findOne({
      _id: assessmentId,
      isPublished: true,
      // startTime: { $lte: now },
      // endTime: { $gte: now },
      assignedTo: { $in: groupIds },
    }).populate({
      path: "sections",
      populate: {
        path: "questions",
        select: "-correctAnswers -explanation", // hide sensitive data
      },
    });

    if (!assessment) {
      // return res
      //   .status(404)
      //   .json({ message: "Assessment not found or not available to you." });
      return Response.error(res, 404, "Assessment not found or not available to you.");
    }

    // // Optional: Shuffle questions per section
    // assessment.sections.forEach((section) => {
    //   section.questions = section.questions.sort(() => 0.5 - Math.random());
    // });

    // res.status(200).json({ assessment });
    return Response.success(res, 200, "Assessments retrieved", assessment);
  } catch (error) {
    // res.status(500).json({ message: "Failed to load assessment", error });
    return Response.error(res, 500, "Failed to load assessments.", error);
  }
};
