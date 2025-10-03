"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandValidations = void 0;
const zod_1 = require("zod");
const createBrandValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({ message: "Brand name is required." })
        .min(1, { message: "Brand name cannot be empty." })
        .max(255),
    description: zod_1.z.string().optional(),
    image: zod_1.z.string().url({ message: "Image must be a valid URL." }).optional(),
    status: zod_1.z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
const updateBrandValidationSchema = createBrandValidationSchema.partial();
exports.BrandValidations = {
    createBrandValidationSchema,
    updateBrandValidationSchema,
};
//# sourceMappingURL=brand.validation.js.map