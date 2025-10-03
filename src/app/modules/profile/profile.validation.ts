import { z } from "zod";

export const updateProfileValidationSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  addressLine1: z.string().min(1, "Address Line 1 is required."),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required."),
  postalCode: z.string().min(1, "Post Code is required."),
  county: z.string().optional().nullable(),
  phoneNumber: z.string().min(1, "Phone number is required."),
});

export type UpdateProfileDto = z.infer<typeof updateProfileValidationSchema>;
