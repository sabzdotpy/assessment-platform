import Assessment from "../models/assessment.model.js";
import User from "../models/user.model.js";
import Group from "../models/group.model.js";

import assessmentValidationSchema from "../schema/assessment_zod.js";

import Response from "../utils/generateResponse.js";
import { HTTP_STATUS } from "../constants/enum/responseCodes.enum.js";
import envs from "../constants/enum/environments.enum.js";

import { NODE_ENV } from "../config/env.js";
import Validator from "../utils/validators.js";

export const createAssessment = async (req, res) => {
  const userId = req.user.id;
  console.log( (NODE_ENV == envs.DEV) ? userId : "");
  try {
    const user = await User.findById(userId);
    console.log( (NODE_ENV == envs.DEV) ? user : "");

    if (!user) {
      return Response.error(res, HTTP_STATUS.UNAUTHORIZED, "User does not exist.", new Error("User not found in db."));
    }

    const parsedData = assessmentValidationSchema.safeParse(req.body);
    if (!parsedData.success) {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, "Assessment validation failed.", parsedData.error.errors);
    }

    const assessment = await Assessment.create({
      ...parsedData.data,
      createdBy: userId,
    });

    return Response.success(res, HTTP_STATUS.CREATED, "Assessment created successfully.", { assessment });
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};

export const getAllAssessments = async (req, res) => {
  try {

    const assessments = await Assessment.find().populate("sections");
    return Response.success(res, HTTP_STATUS.OK, "Successfully retrieved all assessments.", { assessments });

  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, "Error in getting all assessments.", error);
  }
};

export const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate(
      "sections"
    );
    return Response.success(res, HTTP_STATUS.OK, "Successfully retrieved assessment by ID.", { assessment });
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, "Error in retrieving all assessments.", error);
  }
};

export const publishAssessment = async (req, res) => {
  const assessmentId = req.params.id;
  const publishStatus = req.body.status;
  try {
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return Response.error(res, HTTP_STATUS.NOT_FOUND, "Assessment not found.");
    }

    if (assessment.isPublished !== publishStatus) {
      assessment.isPublished = publishStatus;
      await assessment.save();
    } else {
      return Response.error(res, HTTP_STATUS.BAD_REQUEST, `Assessment status is already ${publishStatus}`);
    }
    return Response.success(res, HTTP_STATUS.OK, `Assessment Status: ${publishStatus}`, { assessment });
  } catch (error) {
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, error.message, error);
  }
};


export const assignGroupsToAssessment = async (req, res) => {
  const assessmentId = req.params.id;
  const { groupIds } = req.body; // expected: array of ObjectIds (strings)

  if (!Validator.nonEmptyArray(groupIds)) {
    return Response.error(res, HTTP_STATUS.BAD_REQUEST, "Group IDs must be a non-empty array.");
  }

  try {
    // Validate group existence
    const validGroups = await Group.find({ _id: { $in: groupIds } }).select("_id");
    const validGroupIds = validGroups.map((g) => g._id.toString());

    if (validGroupIds.length !== groupIds.length) {
      return Response.error(
        res,
        HTTP_STATUS.BAD_REQUEST,
        "Some group IDs are invalid.",
        { invalidIDs: groupIds.filter((id) => !validGroupIds.includes(id)) }
      );
    }

    // Update the assessment
    const updatedAssessment = await Assessment.findByIdAndUpdate(
      assessmentId,
      { assignedTo: groupIds },
      { new: true }
    ).populate("assignedTo");

    if (!updatedAssessment) {
      return Response.error(res, HTTP_STATUS.NOT_FOUND, "Assessment not found.");
    }

    // res.status(200).json(updatedAssessment);
    return Response.success(res, HTTP_STATUS.OK, "Assessment successfully assigned to group(s).", { updatedAssessment });
  } catch (err) {
    console.error("Error assigning groups:", err);
    // res.status(500).json({ message: "Internal server error" });
    return Response.error(res, HTTP_STATUS.INTERNAL_ERROR, err.message, err);
  }
};
