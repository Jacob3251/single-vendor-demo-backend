import { Op } from "sequelize";
import Blog from "./blog.model";
import User from "../user/user.model";
import Profile from "../profile/profile.model";

// Helper function to generate a URL-friendly slug from a title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
};

/**
 * Creates a new blog post in the database.
 */
const createBlogPostInDB = async (blogData: any) => {
  // Automatically generate a slug from the title if one isn't provided
  if (!blogData.slug && blogData.title) {
    blogData.slug = generateSlug(blogData.title);
  }
  return Blog.create(blogData);
};

/**
 * Retrieves a paginated and searchable list of all blog posts.
 */
const getAllBlogPostsFromDB = async (options: {
  search?: string;
  page?: number;
  limit?: number;
}) => {
  const { search, page = 1, limit = 10 } = options;
  const whereClause: any = {};

  if (search) {
    whereClause.title = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await Blog.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: User,
        as: "author",
        attributes: ["userId"],
        include: [
          {
            model: Profile,
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
const getBlogPostBySlugFromDB = async (slug: string) => {
  const post = await Blog.findOne({
    where: { slug },
    include: [
      {
        model: User,
        as: "author",
        attributes: ["userId"],
        include: [
          {
            model: Profile,
            as: "profile",
            attributes: ["firstName", "lastName"],
          },
        ],
      },
    ],
  });
  if (!post) throw new Error("Blog post not found");
  return post;
};

/**
 * Retrieves a single blog post by its primary key (ID) for editing.
 */
const getBlogPostByIdFromDB = async (id: number) => {
  const post = await Blog.findByPk(id);
  if (!post) {
    throw new Error("Blog post not found");
  }
  return post;
};

/**
 * Updates an existing blog post.
 */
const updateBlogPostInDB = async (id: number, payload: any) => {
  const post = await Blog.findByPk(id);
  if (!post) throw new Error("Blog post not found");

  if (payload.title && !payload.slug) {
    payload.slug = generateSlug(payload.title);
  }
  return post.update(payload);
};

/**
 * Deletes a single blog post by its ID.
 */
const deleteBlogPostFromDB = async (id: number) => {
  const post = await Blog.findByPk(id);
  if (!post) throw new Error("Blog post not found");
  await post.destroy();
};

/**
 * Deletes multiple blog posts based on an array of IDs.
 */
const deleteMultipleBlogPostsFromDB = async (ids: number[]) => {
  const result = await Blog.destroy({ where: { id: { [Op.in]: ids } } });
  return result;
};

export const BlogServices = {
  createBlogPostInDB,
  getAllBlogPostsFromDB,
  getBlogPostBySlugFromDB,
  getBlogPostByIdFromDB, // Export the new function
  updateBlogPostInDB,
  deleteBlogPostFromDB,
  deleteMultipleBlogPostsFromDB,
};
