import { z } from "zod";

const createBrandValidationSchema = z.object({
  name: z
    .string({ message: "Brand name is required." })
    .min(1, { message: "Brand name cannot be empty." })
    .max(255),
  description: z.string().optional(),
  image: z.string().url({ message: "Image must be a valid URL." }).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

const updateBrandValidationSchema = createBrandValidationSchema.partial();

export const BrandValidations = {
  createBrandValidationSchema,
  updateBrandValidationSchema,
};