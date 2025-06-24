import Assessment from '../../models/assessment.model.js';
import AssessmentAttempt from '../../models/assessmentAttempt.model.js';
import Group from '../../models/group.model.js'; // Needed for group membership resolution


export const getAvailableAssessments = async (req, res) => {
  try {
    const candidateId = req.user.id;
    const now = new Date();

    // Step 1: Find all group IDs where candidate is a member
    const candidateGroups = await Group.find({ members: candidateId }).select('_id');
    const groupIds = candidateGroups.map(group => group._id);

    // Step 2: Find assessments assigned to any of those groups
    const assessments = await Assessment.find({
      isPublished: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
      assignedTo: { $in: groupIds },
    }).select('title description duration startTime endTime');

    res.status(200).json({ assessments });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch available assessments', error });
  }
};

// 🔹 GET /api/assessments/take/:assessmentId
export const getAssessmentForCandidate = async (req, res) => {
  const candidateId = req.user.id;
  const { assessmentId } = req.params;
  const now = new Date();

  try {
    // Step 1: Ensure the candidate has not already attempted this assessment
    const alreadyAttempted = await AssessmentAttempt.findOne({
      candidateId,
      assessmentId,
    });

    if (alreadyAttempted) {
      return res.status(403).json({
        message: 'You have already attempted this assessment.',
      });
    }

    // Step 2: Get group IDs for the candidate
    const candidateGroups = await Group.find({ members: candidateId }).select('_id');
    const groupIds = candidateGroups.map(group => group._id);

    // Step 3: Find and populate the assessment (with access control)
    const assessment = await Assessment.findOne({
      _id: assessmentId,
      isPublished: true,
      startTime: { $lte: now },
      endTime: { $gte: now },
      assignedTo: { $in: groupIds },
    }).populate({
      path: 'sections',
      populate: {
        path: 'questions',
        select: '-correctAnswers -explanation', // hide sensitive data
      },
    });

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found or not available to you.' });
    }

    // Optional: Shuffle questions per section
    assessment.sections.forEach(section => {
      section.questions = section.questions.sort(() => 0.5 - Math.random());
    });

    res.status(200).json({ assessment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to load assessment', error });
  }
};
