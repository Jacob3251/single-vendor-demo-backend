import express, { Request, Response, NextFunction } from "express";
import { ProductControllers } from "./product.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

// Custom middleware to check for SEO or ADMIN role
const seoOrAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore - The authMiddleware attaches the full user object
  const user = req.user;
  if (user && (user.get('userType') === 'ADMIN' || user.get('userType') === 'SEO')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Access is restricted to SEO or Admin users.' });
  }
};

const router = express.Router();

// --- Public Routes ---
router.get("/", ProductControllers.getAllProducts);
router.get("/by-brand/:brandId", ProductControllers.getProductsByBrand);
router.get("/filter/by-type", ProductControllers.getProductsByType);
router.get("/:id", ProductControllers.getProductById);
// Get a single product by its unique slug for the public detail page
router.get("/slug/:slug", ProductControllers.getProductBySlug);

// --- Admin-Only Routes ---
router.post("/", authMiddleware, adminMiddleware, ProductControllers.createProduct);
router.put("/:id", authMiddleware, adminMiddleware, ProductControllers.updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, ProductControllers.deleteProduct);
router.post("/:id/duplicate", authMiddleware, adminMiddleware, ProductControllers.duplicateProduct);
router.delete("/", authMiddleware, adminMiddleware, ProductControllers.deleteMultipleProducts);


// --- SEO & Admin Route ---
router.put("/:id/seo", authMiddleware, seoOrAdminMiddleware, ProductControllers.updateProductSeo);


export default router;

