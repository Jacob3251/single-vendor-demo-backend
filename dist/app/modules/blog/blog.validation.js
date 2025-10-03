"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogValidations = void 0;
const zod_1 = require("zod");
const createBlogValidationSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, "Title is required."),
    content: zod_1.z.string().min(1, "Content is required."),
    featuredImage: zod_1.z.string().url().optional().nullable(),
    featuredImageAlt: zod_1.z.string().optional().nullable(),
    slug: zod_1.z.string().min(1).regex(/^[a-z0-9-]+$/).optional(), // Can be optional if generated from title
    metaTitle: zod_1.z.string().optional().nullable(),
    metaDescription: zod_1.z.string().optional().nullable(),
    metaKeyword: zod_1.z.string().optional().nullable(),
    canonicalUrl: zod_1.z.string().url().optional().nullable(),
    focusKeyword: zod_1.z.string().optional().nullable(),
    ogTitle: zod_1.z.string().optional().nullable(),
    ogDescription: zod_1.z.string().optional().nullable(),
    ogImage: zod_1.z.string().url().optional().nullable(),
    ogImageAlt: zod_1.z.string().optional().nullable(),
    twitterTitle: zod_1.z.string().optional().nullable(),
    twitterDescription: zod_1.z.string().optional().nullable(),
    twitterImage: zod_1.z.string().url().optional().nullable(),
    authorId: zod_1.z.string().uuid("Author ID must be a valid UUID."),
});
const updateBlogValidationSchema = createBlogValidationSchema.partial();
exports.BlogValidations = {
    createBlogValidationSchema,
    updateBlogValidationSchema,
};
//# sourceMappingURL=blog.validation.js.map