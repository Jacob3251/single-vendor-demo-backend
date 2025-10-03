"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductValidations = void 0;
const zod_1 = require("zod");
// Admin creates a product
const createProductValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Product name is required."),
    description: zod_1.z.string().optional().nullable(),
    price: zod_1.z.number().positive("Price must be a positive number."),
    compare_at_price: zod_1.z.number().positive().optional().nullable(),
    barcode: zod_1.z.string().optional().nullable(),
    rating: zod_1.z.number().int().min(1).max(5).optional().nullable(),
    weight: zod_1.z.number().nonnegative("Weight cannot be negative."),
    quantity: zod_1.z.number().int().nonnegative("Quantity cannot be negative."),
    status: zod_1.z.enum(["ACTIVE", "DRAFT"]).optional(),
    type: zod_1.z.enum([
        "LOTION",
        "OIL",
        "SOAP",
        "SHAMPOO",
        "CONDITIONER",
        "MASQUE",
        "SCRUB",
        "LIQUID",
        "MOUSSE",
        "GEL",
        "CREAM",
        "SERUM",
        "CORRECTOR",
        "TUBE",
    ]),
    brandId: zod_1.z.number().int().optional().nullable(),
    // Optional image URL
    image: zod_1.z.preprocess((val) => (val === "" ? undefined : val), zod_1.z.string().url({ message: "Invalid URL format" }).optional().nullable()),
    // SEO fields
    slug: zod_1.z
        .string()
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.")
        .optional()
        .nullable(),
    metaTitle: zod_1.z.string().optional().nullable(),
    metaDescription: zod_1.z.string().optional().nullable(),
    metaKeywords: zod_1.z.string().optional().nullable(),
    canonicalUrl: zod_1.z.preprocess((val) => (val === "" ? undefined : val), zod_1.z.string().url({ message: "Invalid URL format" }).optional().nullable()),
    focusKeyword: zod_1.z.string().optional().nullable(),
    readingTime: zod_1.z.number().int().positive().optional().nullable(),
    seoScore: zod_1.z.number().int().min(0).max(100).optional().nullable(),
});
// Partial schema for admin updates
const updateProductValidationSchema = createProductValidationSchema.partial();
// Schema for SEO-only updates
const updateSeoValidationSchema = zod_1.z.object({
    slug: zod_1.z
        .string()
        .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.")
        .optional()
        .nullable(),
    metaTitle: zod_1.z.string().optional().nullable(),
    metaDescription: zod_1.z.string().optional().nullable(),
    metaKeywords: zod_1.z.string().optional().nullable(),
    canonicalUrl: zod_1.z.preprocess((val) => (val === "" ? undefined : val), zod_1.z.string().url({ message: "Invalid URL format" }).optional().nullable()),
    focusKeyword: zod_1.z.string().optional().nullable(),
    readingTime: zod_1.z.number().int().positive().optional().nullable(),
    seoScore: zod_1.z.number().int().min(0).max(100).optional().nullable(),
});
exports.ProductValidations = {
    createProductValidationSchema,
    updateProductValidationSchema,
    updateSeoValidationSchema,
};
//# sourceMappingURL=products.validation.js.map