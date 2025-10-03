"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
// --- Authenticated User Route ---
// A route for any logged-in user to get their own order history.
router.get("/my-orders", auth_middleware_1.authMiddleware, order_controller_1.OrderControllers.getMyOrders);
// --- Admin-Only Routes ---
// These routes are protected and can only be accessed by users with the 'ADMIN' role.
// Route for an admin to get all orders for a specific user by their ID.
router.get("/user/:userId", auth_middleware_1.authMiddleware, order_controller_1.OrderControllers.getOrdersForUser);
// Route for an admin to create an order manually.
router.post("/manual", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, order_controller_1.OrderControllers.createManualOrder);
// Route for an admin to get a list of all orders (with pagination and filtering).
router.get("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, order_controller_1.OrderControllers.getAllOrders);
// Route for an admin to get a single order by its primary key.
router.get("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, order_controller_1.OrderControllers.getOrderById);
// Route for an admin to update an order's status, tracking ID, etc.
router.put("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, order_controller_1.OrderControllers.updateOrder);
// Route for bulk updating order statuses (dispatch/ship)
router.post("/bulk-update-status", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, order_controller_1.OrderControllers.bulkUpdateStatus);
// Route for generating and downloading a shipping CSV
router.post("/generate-csv", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, order_controller_1.OrderControllers.downloadShippingCsv);
// Route for sending a delivery notification email
router.post("/:id/send-delivery-email", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, order_controller_1.OrderControllers.sendDeliveryEmail);
exports.default = router;
//# sourceMappingURL=order.route.js.map