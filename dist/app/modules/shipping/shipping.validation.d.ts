import { z } from "zod";
export declare const createShippingDispatchValidationSchema: z.ZodObject<{
    orderIds: z.ZodArray<z.ZodNumber>;
    shippingMedium: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateShippingStatusValidationSchema: z.ZodObject<{
    status: z.ZodEnum<{
        DISPATCHED: "DISPATCHED";
        SHIPPED: "SHIPPED";
    }>;
}, z.core.$strip>;
export declare const ShippingValidations: {
    createShippingDispatchValidationSchema: z.ZodObject<{
        orderIds: z.ZodArray<z.ZodNumber>;
        shippingMedium: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    updateShippingStatusValidationSchema: z.ZodObject<{
        status: z.ZodEnum<{
            DISPATCHED: "DISPATCHED";
            SHIPPED: "SHIPPED";
        }>;
    }, z.core.$strip>;
};
//# sourceMappingURL=shipping.validation.d.ts.map