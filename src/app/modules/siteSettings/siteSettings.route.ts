import { Router } from "express";
import { 
  getAll, 
  update, 
  addBanner, 
  updateBanner, 
  deleteBanner 
} from "./siteSettings.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = Router();

// Public: get all site settings
router.get("/", getAll);

// Protected: update entire settings (admin only)
router.put("/:id", authMiddleware, adminMiddleware, update);

// Protected: banner image management (admin only)
router.post("/:id/banners", authMiddleware, adminMiddleware, addBanner);
router.put("/:id/banners/:bannerId", authMiddleware, adminMiddleware, updateBanner);
router.delete("/:id/banners/:bannerId", authMiddleware, adminMiddleware, deleteBanner);

export default router;