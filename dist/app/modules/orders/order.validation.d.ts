import { z } from "zod";
export declare const createManualOrderValidationSchema: z.ZodObject<{
    profile: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        phoneNumber: z.ZodString;
        addressLine1: z.ZodString;
        addressLine2: z.ZodOptional<z.ZodString>;
        city: z.ZodString;
        postalCode: z.ZodString;
    }, z.core.$strip>;
    transactionId: z.ZodString;
    products: z.ZodArray<z.ZodObject<{
        productId: z.ZodNumber;
        quantity: z.ZodNumber;
        price: z.ZodNumber;
        weight: z.ZodNumber;
    }, z.core.$strip>>;
    deliveryMethod: z.ZodString;
}, z.core.$strip>;
export declare const updateOrderValidationSchema: z.ZodObject<{
    fulfillmentStatus: z.ZodOptional<z.ZodEnum<{
        PENDING: "PENDING";
        DISPATCHED: "DISPATCHED";
        SHIPPED: "SHIPPED";
    }>>;
    trackingId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    emailStatus: z.ZodOptional<z.ZodEnum<{
        ConfirmOrder: "ConfirmOrder";
        ShippingDetails: "ShippingDetails";
        Delivery: "Delivery";
    }>>;
    weight: z.ZodOptional<z.ZodNumber>;
    deliveryCompany: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
export declare const updateTrackingIdValidationSchema: z.ZodObject<{
    trackingId: z.ZodString;
}, z.core.$strip>;
export type CreateManualOrderInput = z.infer<typeof createManualOrderValidationSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderValidationSchema>;
//# sourceMappingURL=order.validation.d.ts.map