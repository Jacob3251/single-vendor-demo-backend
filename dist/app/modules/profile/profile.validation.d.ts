import { z } from "zod";
export declare const updateProfileValidationSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    addressLine1: z.ZodString;
    addressLine2: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    city: z.ZodString;
    postalCode: z.ZodString;
    county: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    phoneNumber: z.ZodString;
}, z.core.$strip>;
export type UpdateProfileDto = z.infer<typeof updateProfileValidationSchema>;
//# sourceMappingURL=profile.validation.d.ts.map