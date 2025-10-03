"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTrackingIdValidationSchema = exports.updateOrderValidationSchema = exports.createManualOrderValidationSchema = void 0;
const zod_1 = require("zod");
// Schema for the nested profile object in a manual order
const manualOrderProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1, "First name is required."),
    lastName: zod_1.z.string().min(1, "Last name is required."),
    email: zod_1.z.string().email("Invalid email address."),
    phoneNumber: zod_1.z.string().min(1, "Phone number is required."),
    addressLine1: zod_1.z.string().min(1, "Address is required."),
    addressLine2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(1, "City is required."),
    postalCode: zod_1.z.string().min(1, "Postal code is required."),
});
// Main validation schema for creating a manual order
exports.createManualOrderValidationSchema = zod_1.z.object({
    profile: manualOrderProfileSchema,
    transactionId: zod_1.z.string().min(1, "Transaction ID is required."),
    products: zod_1.z.array(zod_1.z.object({
        productId: zod_1.z.number().int(),
        quantity: zod_1.z.number().int().min(1),
        price: zod_1.z.number(),
        weight: zod_1.z.number(),
    })).min(1, "Order must contain at least one product."),
    deliveryMethod: zod_1.z.string().min(1, "Delivery method is required."),
});
// This schema validates the data sent from the UpdateOrder component.
exports.updateOrderValidationSchema = zod_1.z.object({
    fulfillmentStatus: zod_1.z.enum(["PENDING", "DISPATCHED", "SHIPPED"]).optional(),
    trackingId: zod_1.z.string().nullable().optional(),
    emailStatus: zod_1.z.enum(["ConfirmOrder", "ShippingDetails", "Delivery"]).optional(),
    weight: zod_1.z.number().nonnegative("Weight cannot be negative.").optional(),
    deliveryCompany: zod_1.z.string().nullable().optional(),
});
// This schema can be used for the specific tracking ID update route if needed.
exports.updateTrackingIdValidationSchema = zod_1.z.object({
    trackingId: zod_1.z.string().min(1, "Tracking ID cannot be empty."),
});
//# sourceMappingURL=order.validation.js.map