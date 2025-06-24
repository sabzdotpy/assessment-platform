// /routes/admin.routes.js
import express from "express";
import multer from "multer";

import authMiddleware  from "../../middlewares/auth.middleware.js";
import { addBulkUserFromCSV } from "../../controllers/admin/admin.controller.js";

const router = express.Router();

// Use memory storage (no disk writes)
const upload = multer({ storage: multer.memoryStorage() });

// Route: POST /api/admin/bulk-csv-upload
router.post(
  "/bulk-csv-upload",
  authMiddleware(["admin"]),
  upload.single("file"),
  addBulkUserFromCSV
);

export default router;
