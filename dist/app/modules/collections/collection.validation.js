"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionValidations = void 0;
const zod_1 = require("zod");
const createCollectionValidationSchema = zod_1.z.object({
    name: zod_1.z.string({ message: "Collection name is required." })
        .min(1, "Name cannot be empty."),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.").nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]).optional(),
    order: zod_1.z.number().int().optional(),
    image: zod_1.z.string().url().nullable().optional(),
    productIds: zod_1.z.array(zod_1.z.number().int()).optional(),
});
const updateCollectionValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name cannot be empty.").optional(),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens.").nullable().optional(),
    description: zod_1.z.string().nullable().optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]).optional(),
    order: zod_1.z.number().int().optional(),
    image: zod_1.z.string().url({ message: "Invalid URL format" }).nullable().optional(),
    productIds: zod_1.z.array(zod_1.z.number().int()).optional(),
});
exports.CollectionValidations = {
    createCollectionValidationSchema,
    updateCollectionValidationSchema,
};
//# sourceMappingURL=collection.validation.js.map