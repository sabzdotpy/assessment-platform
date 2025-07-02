import Question from "../models/question.model.js";
import Section from "../models/section.model.js";

import questionValidationSchema from "../schema/question_zod.js";

import Response from "../utils/generateResponse.js";
import { HTTP_STATUS } from "../constants/enum/responseCodes.enum.js";

export const addQuestion = async (req, res) => {
  try {
    //destructure all the items from req.body and validate each

    const parsedData = questionValidationSchema.safeParse(req.body);
    if (!parsedData.success) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "Validation failed", parsedData.error.errors);
      // return res.status(400).json({
      //   message: "Validation failed",
      //   errors: parsedData.error.errors,
      // });
    }

    const question = await Question.create(parsedData.data);
    const sectionId = parsedData.data.sectionId;
    const currSection = await Section.findById(sectionId);

    const currQuestionId = question._id;

    //check if the id is not present in the questionsId array
    currSection.questionIds.push(currQuestionId);
    await currSection.save();

    // res.status(201).json(question);
    return Response.success(res, HTTP_STATUS.CREATED, "Question added.", question);

  } catch (error) {
    // res.status(500).json({ message: error.message });
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, "Error while adding question", error);
  }
};

export const getQuestionsBySection = async (req, res) => {
  const sectionId = req.params.sectionId;
  try {
    const questions = await Question.find({ sectionId });
    // res.json(questions);
    return Response.success(res, HTTP_STATUS.OK, "Retrieved questions by section.", questions);
  } catch (error) {
    // res.status(500).json({ message: error.message });
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, "Error while retrieving questions by section.", error);
  }
};
