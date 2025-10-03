import { Request, Response, NextFunction } from "express";
import { OrderServices } from "./order.service";
import {
  createManualOrderValidationSchema,
  updateOrderValidationSchema,
  CreateManualOrderInput,
  UpdateOrderInput, // Ensure this type is imported
} from "./order.validation";

/**
 * Controller for an admin to create an order manually.
 */
const createManualOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData: CreateManualOrderInput = createManualOrderValidationSchema.parse(req.body);
    const result = await OrderServices.createManualOrderInDB(validatedData);
    res.status(201).json({ success: true, message: "Manual order created successfully.", data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for an admin to get all orders with pagination and filtering.
 */
const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = {
      searchTerm: typeof req.query.search === "string" ? req.query.search : undefined,
      status: typeof req.query.status === "string" ? req.query.status : undefined,
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 10,
    };
    const result = await OrderServices.getAllOrdersFromDB(options);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for an admin to get a single order by its ID.
 */
const getOrderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id ? Number(req.params.id) : NaN;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: { message: "Invalid order ID." } });
    }
    const order = await OrderServices.getOrderByIdFromDB(id);
    if (!order) {
      return res.status(404).json({ success: false, error: { message: "Order not found." } });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for an admin to update an order's details (status, tracking, etc.).
 */
const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id ? Number(req.params.id) : NaN;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: { message: "Invalid order ID." } });
    }
    // ✅ FIX: Explicitly type the validatedData constant with the inferred Zod type.
    const validatedData: UpdateOrderInput = updateOrderValidationSchema.parse(req.body);
    // Ensure deliveryCompany is never null (only string or undefined)
    const sanitizedData = {
      ...validatedData,
      deliveryCompany: validatedData.deliveryCompany === null ? undefined : validatedData.deliveryCompany,
    };
    const order = await OrderServices.updateOrderInDB(id, sanitizedData);
    res.status(200).json({ success: true, message: "Order updated successfully.", data: order });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for an authenticated user to get their own order history.
 */
const getMyOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as Request & { firebaseUser?: { uid: string } }).firebaseUser?.uid;
    if (!userId) {
      return res.status(401).json({ success: false, error: { message: "Unauthorized" } });
    }
    const orders = await OrderServices.getOrdersByUserId(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for an admin to get all orders for a specific user.
 */
const getOrdersForUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, error: { message: "User ID is required." } });
    }
    const orders = await OrderServices.getOrdersByUserId(userId);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller for bulk updating order statuses (dispatch/ship).
 */
const bulkUpdateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderIds, status, shippingMedium } = req.body;
    if (!Array.isArray(orderIds) || !status) {
      return res.status(400).json({ success: false, error: { message: "Invalid payload." } });
    }
    const result = await OrderServices.bulkUpdateOrderStatus(orderIds, status, shippingMedium);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to generate and send a shipping CSV file.
 */
const downloadShippingCsv = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderIds } = req.body;
    if (!Array.isArray(orderIds)) {
      return res.status(400).json({ success: false, error: { message: "Invalid payload." } });
    }
    const csv = await OrderServices.generateShippingCsv(orderIds);
    res.header("Content-Type", "text/csv");
    res.attachment(`shipping_manifest_${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

/**
 * Controller to trigger sending a delivery notification email.
 */
const sendDeliveryEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id ? Number(req.params.id) : NaN;
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: { message: "Invalid order ID." } });
    }
    const result = await OrderServices.sendDeliveryEmail(id);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: { message: (error as Error).message } });
  }
};

export const OrderControllers = {
  createManualOrder,
  getAllOrders,
  getOrderById,
  getMyOrders,
  getOrdersForUser,
  updateOrder,
  bulkUpdateStatus,
  downloadShippingCsv,
  sendDeliveryEmail,
};

