import Assessment from "../models/assessment.model.js";
import Section from "../models/section.model.js";

export const createSection = async (req, res) => {
  try {
    const section = await Section.create(req.body);

    const existingAssessmentId = req.body.assessmentId;
    const currSectionId = section._id;

    const currAssessment = await Assessment.findById(existingAssessmentId);
    currAssessment.sections.push(currSectionId);
    await currAssessment.save();

    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSectionsByAssessment = async (req, res) => {
  const assessmentId = req.params.assessmentId;
  try {
    const sections = await Section.find({ assessmentId }).populate(
      "questionIds"
    );
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
