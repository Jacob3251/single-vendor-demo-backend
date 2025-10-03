"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
// Custom middleware to check for SEO or ADMIN role
const seoOrAdminMiddleware = (req, res, next) => {
    // @ts-ignore - The authMiddleware attaches the full user object
    const user = req.user;
    if (user && (user.get('userType') === 'ADMIN' || user.get('userType') === 'SEO')) {
        next();
    }
    else {
        res.status(403).json({ success: false, message: 'Forbidden: Access is restricted to SEO or Admin users.' });
    }
};
const router = express_1.default.Router();
// --- Public Routes ---
router.get("/", product_controller_1.ProductControllers.getAllProducts);
router.get("/by-brand/:brandId", product_controller_1.ProductControllers.getProductsByBrand);
router.get("/filter/by-type", product_controller_1.ProductControllers.getProductsByType);
router.get("/:id", product_controller_1.ProductControllers.getProductById);
// Get a single product by its unique slug for the public detail page
router.get("/slug/:slug", product_controller_1.ProductControllers.getProductBySlug);
// --- Admin-Only Routes ---
router.post("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, product_controller_1.ProductControllers.createProduct);
router.put("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, product_controller_1.ProductControllers.updateProduct);
router.delete("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, product_controller_1.ProductControllers.deleteProduct);
router.post("/:id/duplicate", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, product_controller_1.ProductControllers.duplicateProduct);
router.delete("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, product_controller_1.ProductControllers.deleteMultipleProducts);
// --- SEO & Admin Route ---
router.put("/:id/seo", auth_middleware_1.authMiddleware, seoOrAdminMiddleware, product_controller_1.ProductControllers.updateProductSeo);
exports.default = router;
//# sourceMappingURL=product.route.js.map