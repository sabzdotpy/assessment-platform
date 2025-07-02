import Question from "../models/question.model.js";
import Section from "../models/section.model.js";

import questionValidationSchema from "../schema/question_zod.js";

import Response from "../utils/generateResponse.js";
import { HTTP_STATUS } from "../constants/enum/responseCodes.enum.js";

export const addQuestion = async (req, res) => {
  try {

    const parsedData = questionValidationSchema.safeParse(req.body);
    if (!parsedData.success) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "Body Validation failed", parsedData.error.errors);
    }

    const question = await Question.create(parsedData.data);
    const sectionId = parsedData.data.sectionId;
    const currSection = await Section.findById(sectionId);

    const currQuestionId = question._id;

    //check if the id is not present in the questionsId array
    if (currSection.questionIds.includes(currQuestionId)) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "This question already exists in this section.");
    }

    currSection.questionIds.push(currQuestionId);
    await currSection.save();

    return Response.success(res, HTTP_STATUS.CREATED, "Question added.", { question });

  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};

export const getQuestionsBySection = async (req, res) => {
  const sectionId = req.params.sectionId;
  try {
    const questions = await Question.find({ sectionId });
    return Response.success(res, HTTP_STATUS.OK, "Retrieved questions by section.", { questions });
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};
