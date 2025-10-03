import { Router } from "express";
import { getAll, update } from "./siteSettings.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = Router();

// Public: get all site settings
router.get("/", getAll);

// Protected update (admin only)
// Example: PUT /api/v1/site-settings/1
router.put("/:id", authMiddleware, adminMiddleware, update);

export default router;
