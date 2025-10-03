import { z } from "zod";
export declare const UserValidations: {
    createUserValidationSchema: z.ZodObject<{
        userType: z.ZodOptional<z.ZodEnum<{
            ADMIN: "ADMIN";
            SEO: "SEO";
            GUEST: "GUEST";
        }>>;
        accessToken: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
    updateUserValidationSchema: z.ZodObject<{
        userType: z.ZodOptional<z.ZodOptional<z.ZodEnum<{
            ADMIN: "ADMIN";
            SEO: "SEO";
            GUEST: "GUEST";
        }>>>;
        accessToken: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    }, z.core.$strip>;
};
//# sourceMappingURL=user.validation.d.ts.map