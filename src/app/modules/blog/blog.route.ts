import express from "express";
import { BlogControllers } from "./blog.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

// --- Public Routes ---
// These routes are accessible to anyone visiting your website.
router.get("/", BlogControllers.getAllBlogPosts);
router.get("/:slug", BlogControllers.getBlogPostBySlug);

// --- Admin-Protected Routes ---
// These routes require the user to be an authenticated administrator (or SEO specialist).

// Get a single post by its ID for editing purposes
router.get("/id/:id", authMiddleware, adminMiddleware, BlogControllers.getBlogPostById);

// Create a new blog post
router.post("/", authMiddleware, adminMiddleware, BlogControllers.createBlogPost);

// Update an existing blog post
router.put("/:id", authMiddleware, adminMiddleware, BlogControllers.updateBlogPost);

// Delete a single blog post
router.delete("/:id", authMiddleware, adminMiddleware, BlogControllers.deleteBlogPost);

// Delete multiple blog posts in bulk
router.delete("/", authMiddleware, adminMiddleware, BlogControllers.deleteMultipleBlogPosts);

export default router;

