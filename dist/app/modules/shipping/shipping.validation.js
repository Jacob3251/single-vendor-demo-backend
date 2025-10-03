"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingValidations = exports.updateShippingStatusValidationSchema = exports.createShippingDispatchValidationSchema = void 0;
const zod_1 = require("zod");
// Validates the payload for the dispatch route
exports.createShippingDispatchValidationSchema = zod_1.z.object({
    orderIds: zod_1.z.array(zod_1.z.number().int().min(1)).min(1, "At least one order ID is required."),
    shippingMedium: zod_1.z.string().optional(), // Optional, defaults to 'Royal Mail' in the service
    // and passed to the order service directly.
});
// You can keep this for future use if you build a separate page for managing shipments
exports.updateShippingStatusValidationSchema = zod_1.z.object({
    status: zod_1.z.enum(["DISPATCHED", "SHIPPED"]),
});
exports.ShippingValidations = {
    createShippingDispatchValidationSchema: exports.createShippingDispatchValidationSchema,
    updateShippingStatusValidationSchema: exports.updateShippingStatusValidationSchema,
};
//# sourceMappingURL=shipping.validation.js.map