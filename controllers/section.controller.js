import Assessment from "../models/assessment.model.js";
import Section from "../models/section.model.js";

import sectionValidationSchema from "../schema/section_zod.js";

import Response from "../utils/generateResponse.js";

export const createSection = async (req, res) => {
  try {

    const parsedData = sectionValidationSchema.safeParse(req.body);
    if (!parsedData.success) {
      // return res.status(400).json({
      //   message: "Validation failed",
      //   errors: parsedData.error.errors,
      // });
      return Response.success(res, 200, "Validation failed", parsedData.error.errors);
    }

    const section = await Section.create(parsedData.data);

    const existingAssessmentId = parsedData.data.assessmentId;
    const currSectionId = section._id;

    const currAssessment = await Assessment.findById(existingAssessmentId);
    currAssessment.sections.push(currSectionId);
    await currAssessment.save();

    // res.status(201).json(section);
    return Response.success(res, 200, "Section created successfully.", section);
  } catch (error) {
    // res.status(500).json({ message: error.message });
    return Response.error(res, 500, "Error in section creation.", error);
  }
};

export const getSectionsByAssessment = async (req, res) => {
  const assessmentId = req.params.assessmentId;
  try {
    const sections = await Section.find({ assessmentId }).populate(
      "questionIds"
    );
    // res.json(sections);
    return Response.success(res, 200, "Successfully retrieved sections by assessment.", sections);
  } catch (error) {
    // res.status(500).json({ message: error.message });
    return Response.error(res, 500, "Error while getting sections by assessment.", error);
  }
};
