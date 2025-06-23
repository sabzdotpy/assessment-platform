import Assessment from "../models/assessment.model.js";

export const createAssessment = async (req, res) => {
  try {
    //destruct the content and validate
    const assessment = await Assessment.create(req.body);

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
