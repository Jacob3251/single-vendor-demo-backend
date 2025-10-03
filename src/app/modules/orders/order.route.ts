import express from "express";
import { OrderControllers } from "./order.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

// --- Authenticated User Route ---
// A route for any logged-in user to get their own order history.
router.get("/my-orders", authMiddleware, OrderControllers.getMyOrders);


// --- Admin-Only Routes ---
// These routes are protected and can only be accessed by users with the 'ADMIN' role.

// Route for an admin to get all orders for a specific user by their ID.
router.get("/user/:userId", authMiddleware, OrderControllers.getOrdersForUser);

// Route for an admin to create an order manually.
router.post("/manual", authMiddleware, adminMiddleware, OrderControllers.createManualOrder);

// Route for an admin to get a list of all orders (with pagination and filtering).
router.get("/", authMiddleware, adminMiddleware, OrderControllers.getAllOrders);

// Route for an admin to get a single order by its primary key.
router.get("/:id", authMiddleware, adminMiddleware, OrderControllers.getOrderById);

// Route for an admin to update an order's status, tracking ID, etc.
router.put("/:id", authMiddleware, adminMiddleware, OrderControllers.updateOrder);

// Route for bulk updating order statuses (dispatch/ship)
router.post("/bulk-update-status", authMiddleware, adminMiddleware, OrderControllers.bulkUpdateStatus);

// Route for generating and downloading a shipping CSV
router.post("/generate-csv", authMiddleware, adminMiddleware, OrderControllers.downloadShippingCsv);

// Route for sending a delivery notification email
router.post("/:id/send-delivery-email", authMiddleware, adminMiddleware, OrderControllers.sendDeliveryEmail);


export default router;

