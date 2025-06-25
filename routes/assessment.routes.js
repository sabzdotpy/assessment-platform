import express from "express";
import {
  createAssessment,
  getAllAssessments,
  publishAssessment,
  getAssessmentById,
  assignGroupsToAssessment,
} from "../controllers/assessment.controller.js";

const router = express.Router();
// for both admin and trainer can access it
router.post("/", createAssessment);
router.get("/", getAllAssessments);
router.get("/:id", getAssessmentById);
router.patch("/:id/update-publish-status", publishAssessment);

router.patch("/:id/assign-groups", assignGroupsToAssessment);

export default router;
