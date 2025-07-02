import Assessment from "../models/assessment.model.js";
import Section from "../models/section.model.js";

import sectionValidationSchema from "../schema/section_zod.js";

import Response from "../utils/generateResponse.js";
import { HTTP_STATUS } from "../constants/enum/responseCodes.enum.js";

export const createSection = async (req, res) => {
  try {

    const parsedData = sectionValidationSchema.safeParse(req.body);
    if (!parsedData.success) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "Validation failed", parsedData.error.errors);
    }

    const section = await Section.create(parsedData.data);

    const existingAssessmentId = parsedData.data.assessmentId;
    const currSectionId = section._id;

    const currAssessment = await Assessment.findById(existingAssessmentId);
    currAssessment.sections.push(currSectionId);
    await currAssessment.save();

    return Response.success(res, HTTP_STATUS.CREATED, "Section created successfully.", { section });
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, "Error in section creation.", error);
  }
};

export const getSectionsByAssessment = async (req, res) => {
  const assessmentId = req.params.assessmentId;
  try {
    const sections = await Section.find({ assessmentId }).populate(
      "questionIds"
    );
    return Response.success(res, HTTP_STATUS.OK, "Successfully retrieved sections by assessment.", { sections });
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};
