"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blog_controller_1 = require("./blog.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
// --- Public Routes ---
// These routes are accessible to anyone visiting your website.
router.get("/", blog_controller_1.BlogControllers.getAllBlogPosts);
router.get("/:slug", blog_controller_1.BlogControllers.getBlogPostBySlug);
// --- Admin-Protected Routes ---
// These routes require the user to be an authenticated administrator (or SEO specialist).
// Get a single post by its ID for editing purposes
router.get("/id/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, blog_controller_1.BlogControllers.getBlogPostById);
// Create a new blog post
router.post("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, blog_controller_1.BlogControllers.createBlogPost);
// Update an existing blog post
router.put("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, blog_controller_1.BlogControllers.updateBlogPost);
// Delete a single blog post
router.delete("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, blog_controller_1.BlogControllers.deleteBlogPost);
// Delete multiple blog posts in bulk
router.delete("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, blog_controller_1.BlogControllers.deleteMultipleBlogPosts);
exports.default = router;
//# sourceMappingURL=blog.route.js.map