import { Request, Response, NextFunction } from "express";
import { BlogServices } from "./blog.service";

/**
 * Controller to handle the creation of a new blog post.
 */
const createBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Note: You would add Zod validation here before calling the service
    const post = await BlogServices.createBlogPostInDB(req.body);
    res.status(201).json({ success: true, message: "Blog post created successfully.", data: post });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get all blog posts, with support for searching and pagination.
 */
const getAllBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options: { search?: string; page?: number; limit?: number } = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };
    
    // Fix: Only add search if it exists and is a string
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      options.search = req.query.search;
    }
    
    const result = await BlogServices.getAllBlogPostsFromDB(options);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Fix: Properly closed function
 */
const getBlogPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    if (!slug || typeof slug !== "string") {
      return res.status(400).json({ success: false, error: { message: "Invalid slug parameter." } });
    }
    const post = await BlogServices.getBlogPostBySlugFromDB(slug);
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to get a single blog post by its ID (for admin editing).
 */
const getBlogPostById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: { message: "ID parameter is required." } });
    }
    const post = await BlogServices.getBlogPostByIdFromDB(Number(id));
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update an existing blog post.
 */
const updateBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: { message: "ID parameter is required." } });
    }
    // Note: You would add Zod validation here
    const post = await BlogServices.updateBlogPostInDB(Number(id), req.body);
    res.status(200).json({ success: true, message: "Blog post updated successfully.", data: post });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete a single blog post.
 */
const deleteBlogPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: { message: "ID parameter is required." } });
    }
    await BlogServices.deleteBlogPostFromDB(Number(id));
    res.status(200).json({ success: true, message: "Blog post deleted successfully.", data: null });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to delete multiple blog posts in bulk.
 */
const deleteMultipleBlogPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ids } = req.body; // Expecting an array of post IDs
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({ success: false, error: { message: "Invalid input: 'ids' must be an array." } });
        }
        await BlogServices.deleteMultipleBlogPostsFromDB(ids);
        res.status(200).json({ success: true, message: `${ids.length} blog posts deleted successfully.`});
    } catch (error) {
        next(error);
    }
};

// Fix: Export the correct function name
export const BlogControllers = {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostBySlug,  // Fixed name
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  deleteMultipleBlogPosts,
};