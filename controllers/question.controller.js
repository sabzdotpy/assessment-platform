import Question from "../models/question.model.js";
import Section from "../models/section.model.js";

export const addQuestion = async (req, res) => {
  try {
    //destructure all the items from req.body and validate each
    const question = await Question.create(req.body);
    const sectionId = req.body.sectionId;
    const currSection = await Section.findById(sectionId);

    const currQuestionId = question._id;

    //check if the id is not present in the questionsId array
    currSection.questionIds.push(currQuestionId);
    await currSection.save();

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuestionsBySection = async (req, res) => {
  const sectionId = req.params.sectionId;
  try {
    const questions = await Question.find({ sectionId });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
