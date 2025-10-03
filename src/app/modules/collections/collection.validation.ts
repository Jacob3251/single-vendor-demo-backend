import { z } from "zod";

const createCollectionValidationSchema = z.object({
  name: z.string({ message: "Collection name is required." })
          .min(1, "Name cannot be empty."),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.").nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  order: z.number().int().optional(),
  image: z.string().url().nullable().optional(),
  productIds: z.array(z.number().int()).optional(),
});

const updateCollectionValidationSchema = z.object({
  name: z.string().min(1, "Name cannot be empty.").optional(),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.").nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  order: z.number().int().optional(),
  image: z.string().url({ message: "Invalid URL format" }).nullable().optional(),
  productIds: z.array(z.number().int()).optional(),
});

export const CollectionValidations = {
  createCollectionValidationSchema,
  updateCollectionValidationSchema,
};