import { z } from "zod";

const createUserValidationSchema = z.object({
  userType: z.enum(["ADMIN", "SEO", "GUEST"]).optional(),
  accessToken: z.string().optional().nullable(),
});

const updateUserValidationSchema = createUserValidationSchema.partial();

export const UserValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
