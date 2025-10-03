"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingServices = void 0;
const shipping_model_1 = __importDefault(require("./shipping.model"));
const order_model_1 = __importDefault(require("../orders/order.model"));
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
/**
 * Creates individual shipping records for a batch of orders and updates their status to DISPATCHED.
 * This is the core logic called by your /shipping/dispatch endpoint.
 * @param orderIds - An array of Order IDs to be dispatched.
 * @param shippingMedium - The courier selected by the admin (optional, with a default).
 */
const createShippingDispatch = async (orderIds, shippingMedium = "Royal Mail") => {
    const transaction = await database_1.default.transaction();
    try {
        // Step 1: Find all selected orders that are currently in 'PENDING' status.
        const ordersToUpdate = await order_model_1.default.findAll({
            where: {
                id: { [sequelize_1.Op.in]: orderIds },
                fulfillmentStatus: "PENDING",
            },
            transaction,
        });
        // If the number of found orders doesn't match, it means some were invalid.
        if (ordersToUpdate.length !== orderIds.length) {
            throw new Error("One or more selected orders are not valid for dispatch (they may not exist or are not in PENDING status).");
        }
        // Step 2: Create a new Shipping record for each valid order.
        const shippingRecords = ordersToUpdate.map((order) => ({
            orderId: order.get("id"),
            shippingMedium: shippingMedium,
            status: "DISPATCHED",
        }));
        await shipping_model_1.default.bulkCreate(shippingRecords, { transaction });
        // Step 3: Update the status of the orders to 'DISPATCHED'.
        await order_model_1.default.update({ fulfillmentStatus: "DISPATCHED" }, { where: { id: { [sequelize_1.Op.in]: orderIds } }, transaction });
        // TODO: In a future step, you would trigger the "Order Dispatched" emails here.
        await transaction.commit();
        return {
            message: `${orderIds.length} orders have been dispatched successfully.`,
        };
    }
    catch (error) {
        await transaction.rollback();
        console.error("Failed to create shipping dispatch:", error);
        // Re-throw the error to be handled by the controller
        throw error;
    }
};
/**
 * Updates the status of an entire shipping batch to 'SHIPPED'.
 * @param {number} shippingId - The ID of the shipping record to update.
 * @returns {Promise<Shipping>} The updated shipping instance.
 */
const updateShippingStatusToShipped = async (shippingId) => {
    const shipping = await shipping_model_1.default.findByPk(shippingId);
    if (!shipping) {
        throw new Error("Shipping record not found");
    }
    await shipping.update({ status: "SHIPPED", shippingTime: new Date() });
    // Also update the associated order to 'SHIPPED'
    await order_model_1.default.update({ fulfillmentStatus: "SHIPPED" }, { where: { id: shipping.get("orderId") } });
    // TODO: You would trigger the "Order Shipped" email here.
    return shipping;
};
/**
 * Creates individual shipping records for a batch of orders being dispatched.
 * This function is called by the order service from within a database transaction.
 * @param orderIds - An array of order IDs to create shipping records for.
 * @param shippingMedium - The courier service being used (e.g., 'Royal Mail').
 * @param transaction - A Sequelize transaction object to ensure atomicity.
 */
const createDispatchRecords = async (orderIds, shippingMedium, transaction) => {
    // Prepare a shipping record object for each order ID provided
    const shippingRecords = orderIds.map((orderId) => ({
        orderId,
        shippingMedium,
        status: "DISPATCHED",
    }));
    // Use bulkCreate to insert all the new shipping records in a single, efficient database query
    await shipping_model_1.default.bulkCreate(shippingRecords, { transaction });
};
exports.ShippingServices = {
    createShippingDispatch,
    updateShippingStatusToShipped,
    createDispatchRecords,
};
//# sourceMappingURL=shipping.service.js.map