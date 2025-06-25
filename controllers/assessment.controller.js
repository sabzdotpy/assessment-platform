import Assessment from "../models/assessment.model.js";
import User from "../models/user.model.js";

export const createAssessment = async (req, res) => {
  const userId = req.user.id;
  console.log(userId);
  try {
    const user = await User.findById(userId);
    console.log(user);

    if (!user) {
      res.status(500).json({ message: "User does not exist" });
    }
    //destruct the content and validate
    const assessment = await Assessment.create({
      ...req.body,
      createdBy: userId,
    });

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find().populate("sections");
    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate(
      "sections"
    );
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const publishAssessment = async (req, res) => {
  const assessmentId = req.params.id;
  const publishStatus = req.body.status;
  try {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    if (assessment.isPublished !== publishStatus) {
      assessment.isPublished = publishStatus;
      await assessment.save();
    } else {
      return res
        .status(400)
        .json({ message: `Assessment status is already ${publishStatus}` });
    }
    res.json({
      message: `Assessment status: ${publishStatus}`,
      assessment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



import Group from "../models/group.model.js";

export const assignGroupsToAssessment = async (req, res) => {
  const assessmentId = req.params.id;
  const { groupIds } = req.body; // expected: array of ObjectIds (strings)

  if (!Array.isArray(groupIds) || groupIds.length === 0) {
    return res.status(400).json({ message: "groupIds must be a non-empty array" });
  }

  try {
    // Validate group existence
    const validGroups = await Group.find({ _id: { $in: groupIds } }).select("_id");
    const validGroupIds = validGroups.map((g) => g._id.toString());

    if (validGroupIds.length !== groupIds.length) {
      return res.status(400).json({
        message: "Some group IDs are invalid",
        invalidIds: groupIds.filter((id) => !validGroupIds.includes(id)),
      });
    }

    // Update the assessment
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      { assignedTo: groupIds },
      { new: true }
    ).populate("assignedTo");

    if (!updatedAssessment) {
      return res.status(404).json({ message: "Assessment not found" });
    }

    res.status(200).json(updatedAssessment);
  } catch (err) {
    console.error("Error assigning groups:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
