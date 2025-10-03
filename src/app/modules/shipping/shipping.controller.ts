import { Request, Response, NextFunction } from "express";
import { ShippingServices } from "./shipping.service";
import { createShippingDispatchValidationSchema } from "./shipping.validation"; // Assuming your validation file exists

/**
 * Controller to handle the creation of a new shipping dispatch from a list of order IDs.
 * This is called when an admin clicks the "Dispatch" button.
 */
const createShippingDispatch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate the incoming payload to ensure it's an array of order IDs
    const { orderIds, shippingMedium } = createShippingDispatchValidationSchema.parse(req.body);
    
    const result = await ShippingServices.createShippingDispatch(orderIds, shippingMedium);
    res.status(201).json({ success: true, message: "Orders dispatched successfully.", data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to update the status of a shipping record to "SHIPPED".
 */
const updateShippingStatusToShipped = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const shipping = await ShippingServices.updateShippingStatusToShipped(Number(id));
    res.status(200).json({ success: true, message: "Shipping status updated to SHIPPED.", data: shipping });
  } catch (error) {
    next(error);
  }
};

export const ShippingControllers = {
  createShippingDispatch,
  updateShippingStatusToShipped,
};

