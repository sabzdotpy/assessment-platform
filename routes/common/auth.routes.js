// Common Auth Routes.
// Contains authentication routes (login, register, public routes, password reset, etc.)
// * Route: /api/v1/common/auth/(...)

import express from "express";

import authMiddleware from "../../middlewares/auth.middleware.js";

import * as commonAuthController from "../../controllers/common/auth.controller.js"

import userRole from "../../constants/enum/userRole.enum.js";

const router = express.Router();


router.post("/register", commonAuthController.register);

router.post("/login", commonAuthController.login);

// change password - need old and new password
router.post("/change-password", authMiddleware(Object.values(userRole)), commonAuthController.changePassword);

// send reset password link - need email
router.post("/send-reset-password-link", commonAuthController.sendResetPasswordLink);

// reset password - need token and new password
router.post("/reset-password", commonAuthController.resetPassword);

export default router;