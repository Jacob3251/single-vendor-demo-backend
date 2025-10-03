import { z } from "zod";

// Admin creates a product
const createProductValidationSchema = z.object({
  name: z.string().min(1, "Product name is required."),
  description: z.string().optional().nullable(),
  price: z.number().positive("Price must be a positive number."),
  compare_at_price: z.number().positive().optional().nullable(),
  barcode: z.string().optional().nullable(),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  weight: z.number().nonnegative("Weight cannot be negative."),
  quantity: z.number().int().nonnegative("Quantity cannot be negative."),
  status: z.enum(["ACTIVE", "DRAFT"]).optional(),
  type: z.enum([
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
  brandId: z.number().int().optional().nullable(),

  // Optional image URL
  image: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url({ message: "Invalid URL format" }).optional().nullable()
  ),

  // SEO fields
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.")
    .optional()
    .nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),

  canonicalUrl: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url({ message: "Invalid URL format" }).optional().nullable()
  ),

  focusKeyword: z.string().optional().nullable(),
  readingTime: z.number().int().positive().optional().nullable(),
  seoScore: z.number().int().min(0).max(100).optional().nullable(),
});

// Partial schema for admin updates
const updateProductValidationSchema = createProductValidationSchema.partial();

// Schema for SEO-only updates
const updateSeoValidationSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.")
    .optional()
    .nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  metaKeywords: z.string().optional().nullable(),

  canonicalUrl: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url({ message: "Invalid URL format" }).optional().nullable()
  ),

  focusKeyword: z.string().optional().nullable(),
  readingTime: z.number().int().positive().optional().nullable(),
  seoScore: z.number().int().min(0).max(100).optional().nullable(),
});

// Export types inferred from Zod
export type CreateProductInput = z.infer<typeof createProductValidationSchema>;
export type UpdateProductInput = z.infer<typeof updateProductValidationSchema>;
export type UpdateSeoInput = z.infer<typeof updateSeoValidationSchema>;

export const ProductValidations = {
  createProductValidationSchema,
  updateProductValidationSchema,
  updateSeoValidationSchema,
};
