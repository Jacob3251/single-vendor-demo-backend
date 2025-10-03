import { z } from "zod";

const createBlogValidationSchema = z.object({
  title: z.string().min(1, "Title is required."),
  content: z.string().min(1, "Content is required."),
  featuredImage: z.string().url().optional().nullable(),
  featuredImageAlt: z.string().optional().nullable(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/).optional(), // Can be optional if generated from title
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeyword: z.string().optional().nullable(),
  canonicalUrl: z.string().url().optional().nullable(),
  focusKeyword: z.string().optional().nullable(),
  ogTitle: z.string().optional().nullable(),
  ogDescription: z.string().optional().nullable(),
  ogImage: z.string().url().optional().nullable(),
  ogImageAlt: z.string().optional().nullable(),
  twitterTitle: z.string().optional().nullable(),
  twitterDescription: z.string().optional().nullable(),
  twitterImage: z.string().url().optional().nullable(),
  authorId: z.string().uuid("Author ID must be a valid UUID."),
});

const updateBlogValidationSchema = createBlogValidationSchema.partial();

export const BlogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};
