"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidationSchema = void 0;
const zod_1 = require("zod");
exports.updateProfileValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "First name is required."),
    lastName: zod_1.z.string().min(1, "Last name is required."),
    addressLine1: zod_1.z.string().min(1, "Address Line 1 is required."),
    addressLine2: zod_1.z.string().optional().nullable(),
    city: zod_1.z.string().min(1, "City is required."),
    postalCode: zod_1.z.string().min(1, "Post Code is required."),
    county: zod_1.z.string().optional().nullable(),
    phoneNumber: zod_1.z.string().min(1, "Phone number is required."),
});
//# sourceMappingURL=profile.validation.js.map