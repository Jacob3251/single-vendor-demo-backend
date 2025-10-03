"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogServices = void 0;
const sequelize_1 = require("sequelize");
const blog_model_1 = __importDefault(require("./blog.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const profile_model_1 = __importDefault(require("../profile/profile.model"));
// Helper function to generate a URL-friendly slug from a title
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Remove consecutive hyphens
};
/**
 * Creates a new blog post in the database.
 */
const createBlogPostInDB = async (blogData) => {
    // Automatically generate a slug from the title if one isn't provided
    if (!blogData.slug && blogData.title) {
        blogData.slug = generateSlug(blogData.title);
    }
    return blog_model_1.default.create(blogData);
};
/**
 * Retrieves a paginated and searchable list of all blog posts.
 */
const getAllBlogPostsFromDB = async (options) => {
    const { search, page = 1, limit = 10 } = options;
    const whereClause = {};
    if (search) {
        whereClause.title = { [sequelize_1.Op.iLike]: `%${search}%` };
    }
    const { count, rows } = await blog_model_1.default.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: user_model_1.default,
                as: "author",
                attributes: ["userId"],
                include: [
                    {
                        model: profile_model_1.default,
                        as: "profile",
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
        ],
        order: [["createdAt", "DESC"]],
        limit,
        offset: (page - 1) * limit,
        distinct: true,
    });
    return {
        posts: rows,
        meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    };
};
/**
 * Retrieves a single blog post by its unique slug for public viewing.
 */
const getBlogPostBySlugFromDB = async (slug) => {
    const post = await blog_model_1.default.findOne({
        where: { slug },
        include: [
            {
                model: user_model_1.default,
                as: "author",
                attributes: ["userId"],
                include: [
                    {
                        model: profile_model_1.default,
                        as: "profile",
                        attributes: ["firstName", "lastName"],
                    },
                ],
            },
        ],
    });
    if (!post)
        throw new Error("Blog post not found");
    return post;
};
/**
 * Retrieves a single blog post by its primary key (ID) for editing.
 */
const getBlogPostByIdFromDB = async (id) => {
    const post = await blog_model_1.default.findByPk(id);
    if (!post) {
        throw new Error("Blog post not found");
    }
    return post;
};
/**
 * Updates an existing blog post.
 */
const updateBlogPostInDB = async (id, payload) => {
    const post = await blog_model_1.default.findByPk(id);
    if (!post)
        throw new Error("Blog post not found");
    if (payload.title && !payload.slug) {
        payload.slug = generateSlug(payload.title);
    }
    return post.update(payload);
};
/**
 * Deletes a single blog post by its ID.
 */
const deleteBlogPostFromDB = async (id) => {
    const post = await blog_model_1.default.findByPk(id);
    if (!post)
        throw new Error("Blog post not found");
    await post.destroy();
};
/**
 * Deletes multiple blog posts based on an array of IDs.
 */
const deleteMultipleBlogPostsFromDB = async (ids) => {
    const result = await blog_model_1.default.destroy({ where: { id: { [sequelize_1.Op.in]: ids } } });
    return result;
};
exports.BlogServices = {
    createBlogPostInDB,
    getAllBlogPostsFromDB,
    getBlogPostBySlugFromDB,
    getBlogPostByIdFromDB, // Export the new function
    updateBlogPostInDB,
    deleteBlogPostFromDB,
    deleteMultipleBlogPostsFromDB,
};
//# sourceMappingURL=blog.service.js.map