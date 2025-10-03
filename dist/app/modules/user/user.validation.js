"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const zod_1 = require("zod");
const createUserValidationSchema = zod_1.z.object({
    userType: zod_1.z.enum(["ADMIN", "SEO", "GUEST"]).optional(),
    accessToken: zod_1.z.string().optional().nullable(),
});
const updateUserValidationSchema = createUserValidationSchema.partial();
exports.UserValidations = {
    createUserValidationSchema,
    updateUserValidationSchema,
};
//# sourceMappingURL=user.validation.js.map