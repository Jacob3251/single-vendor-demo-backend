"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogControllers = void 0;
const blog_service_1 = require("./blog.service");
/**
 * Controller to handle the creation of a new blog post.
 */
const createBlogPost = async (req, res, next) => {
    try {
        // Note: You would add Zod validation here before calling the service
        const post = await blog_service_1.BlogServices.createBlogPostInDB(req.body);
        res.status(201).json({ success: true, message: "Blog post created successfully.", data: post });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Controller to get all blog posts, with support for searching and pagination.
 */
const getAllBlogPosts = async (req, res, next) => {
    try {
        const options = {
            page: req.query.page ? parseInt(req.query.page, 10) : 1,
            limit: req.query.limit ? parseInt(req.query.limit, 10) : 10,
        };
        // Fix: Only add search if it exists and is a string
        if (typeof req.query.search === "string" && req.query.search.trim()) {
            options.search = req.query.search;
        }
        const result = await blog_service_1.BlogServices.getAllBlogPostsFromDB(options);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Fix: Properly closed function
 */
const getBlogPostBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        if (!slug || typeof slug !== "string") {
            return res.status(400).json({ success: false, error: { message: "Invalid slug parameter." } });
        }
        const post = await blog_service_1.BlogServices.getBlogPostBySlugFromDB(slug);
        res.status(200).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Controller to get a single blog post by its ID (for admin editing).
 */
const getBlogPostById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: { message: "ID parameter is required." } });
        }
        const post = await blog_service_1.BlogServices.getBlogPostByIdFromDB(Number(id));
        res.status(200).json({ success: true, data: post });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Controller to update an existing blog post.
 */
const updateBlogPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: { message: "ID parameter is required." } });
        }
        // Note: You would add Zod validation here
        const post = await blog_service_1.BlogServices.updateBlogPostInDB(Number(id), req.body);
        res.status(200).json({ success: true, message: "Blog post updated successfully.", data: post });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Controller to delete a single blog post.
 */
const deleteBlogPost = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, error: { message: "ID parameter is required." } });
        }
        await blog_service_1.BlogServices.deleteBlogPostFromDB(Number(id));
        res.status(200).json({ success: true, message: "Blog post deleted successfully.", data: null });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Controller to delete multiple blog posts in bulk.
 */
const deleteMultipleBlogPosts = async (req, res, next) => {
    try {
        const { ids } = req.body; // Expecting an array of post IDs
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, error: { message: "Invalid input: 'ids' must be an array." } });
        }
        await blog_service_1.BlogServices.deleteMultipleBlogPostsFromDB(ids);
        res.status(200).json({ success: true, message: `${ids.length} blog posts deleted successfully.` });
    }
    catch (error) {
        next(error);
    }
};
// Fix: Export the correct function name
exports.BlogControllers = {
    createBlogPost,
    getAllBlogPosts,
    getBlogPostBySlug, // Fixed name
    getBlogPostById,
    updateBlogPost,
    deleteBlogPost,
    deleteMultipleBlogPosts,
};
//# sourceMappingURL=blog.controller.js.map