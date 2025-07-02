// Common Auth Routes.
// Contains authentication routes (login, register, public routes, password reset, etc.)
// * Route: /api/v1/common/auth/(...)

import express from "express";

import * as commonAuthController from "../../controllers/common/auth.controller.js"

const router = express.Router();


router.post("/register", commonAuthController.register);

router.post("/login", commonAuthController.login);

export default router;