import { z } from "zod";
export declare const CollectionValidations: {
    createCollectionValidationSchema: z.ZodObject<{
        name: z.ZodString;
        slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodOptional<z.ZodEnum<{
            ACTIVE: "ACTIVE";
            INACTIVE: "INACTIVE";
        }>>;
        order: z.ZodOptional<z.ZodNumber>;
        image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        productIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>;
    updateCollectionValidationSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        slug: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodOptional<z.ZodEnum<{
            ACTIVE: "ACTIVE";
            INACTIVE: "INACTIVE";
        }>>;
        order: z.ZodOptional<z.ZodNumber>;
        image: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        productIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>;
};
//# sourceMappingURL=collection.validation.d.ts.map