import { z } from "zod";

// Schema for the nested profile object in a manual order
const manualOrderProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  email: z.string().email("Invalid email address."),
  phoneNumber: z.string().min(1, "Phone number is required."),
  addressLine1: z.string().min(1, "Address is required."),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required."),
  postalCode: z.string().min(1, "Postal code is required."),
});

// Main validation schema for creating a manual order
export const createManualOrderValidationSchema = z.object({
  profile: manualOrderProfileSchema,
  transactionId: z.string().min(1, "Transaction ID is required."),
  products: z.array(
    z.object({
      productId: z.number().int(),
      quantity: z.number().int().min(1),
      price: z.number(),
      weight: z.number(),
    })
  ).min(1, "Order must contain at least one product."),
  deliveryMethod: z.string().min(1, "Delivery method is required."),
});

// This schema validates the data sent from the UpdateOrder component.
export const updateOrderValidationSchema = z.object({
  fulfillmentStatus: z.enum(["PENDING", "DISPATCHED", "SHIPPED"]).optional(),
  trackingId: z.string().nullable().optional(),
  emailStatus: z.enum(["ConfirmOrder", "ShippingDetails", "Delivery"]).optional(),
  weight: z.number().nonnegative("Weight cannot be negative.").optional(),
  deliveryCompany: z.string().nullable().optional(),
});

// This schema can be used for the specific tracking ID update route if needed.
export const updateTrackingIdValidationSchema = z.object({
  trackingId: z.string().min(1, "Tracking ID cannot be empty."),
});

// 🔹 Export inferred types for use in controllers/services
export type CreateManualOrderInput = z.infer<typeof createManualOrderValidationSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderValidationSchema>;
