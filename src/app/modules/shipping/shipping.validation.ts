import { z } from "zod";

// Validates the payload for the dispatch route
export const createShippingDispatchValidationSchema = z.object({
  orderIds: z.array(z.number().int().min(1)).min(1, "At least one order ID is required."),
  shippingMedium: z.string().optional(), // Optional, defaults to 'Royal Mail' in the service
  // and passed to the order service directly.
});

// You can keep this for future use if you build a separate page for managing shipments
export const updateShippingStatusValidationSchema = z.object({
  status: z.enum(["DISPATCHED", "SHIPPED"]),
});

export const ShippingValidations = {
  createShippingDispatchValidationSchema,
  updateShippingStatusValidationSchema,
};
