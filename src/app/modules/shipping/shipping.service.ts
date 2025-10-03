import Shipping from "./shipping.model";
import Order from "../orders/order.model";
import { Op } from "sequelize";
import sequelize from "../../database";
import { Transaction } from "sequelize";

/**
 * Creates individual shipping records for a batch of orders and updates their status to DISPATCHED.
 * This is the core logic called by your /shipping/dispatch endpoint.
 * @param orderIds - An array of Order IDs to be dispatched.
 * @param shippingMedium - The courier selected by the admin (optional, with a default).
 */
const createShippingDispatch = async (
  orderIds: number[],
  shippingMedium: string = "Royal Mail"
) => {
  const transaction = await sequelize.transaction();
  try {
    // Step 1: Find all selected orders that are currently in 'PENDING' status.
    const ordersToUpdate = await Order.findAll({
      where: {
        id: { [Op.in]: orderIds },
        fulfillmentStatus: "PENDING",
      },
      transaction,
    });

    // If the number of found orders doesn't match, it means some were invalid.
    if (ordersToUpdate.length !== orderIds.length) {
      throw new Error(
        "One or more selected orders are not valid for dispatch (they may not exist or are not in PENDING status)."
      );
    }

    // Step 2: Create a new Shipping record for each valid order.
    const shippingRecords = ordersToUpdate.map((order) => ({
      orderId: order.get("id"),
      shippingMedium: shippingMedium,
      status: "DISPATCHED" as const,
    }));
    await Shipping.bulkCreate(shippingRecords, { transaction });

    // Step 3: Update the status of the orders to 'DISPATCHED'.
    await Order.update(
      { fulfillmentStatus: "DISPATCHED" },
      { where: { id: { [Op.in]: orderIds } }, transaction }
    );

    // TODO: In a future step, you would trigger the "Order Dispatched" emails here.

    await transaction.commit();
    return {
      message: `${orderIds.length} orders have been dispatched successfully.`,
    };
  } catch (error) {
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
const updateShippingStatusToShipped = async (
  shippingId: number
): Promise<Shipping> => {
  const shipping = await Shipping.findByPk(shippingId);
  if (!shipping) {
    throw new Error("Shipping record not found");
  }

  await shipping.update({ status: "SHIPPED", shippingTime: new Date() });

  // Also update the associated order to 'SHIPPED'
  await Order.update(
    { fulfillmentStatus: "SHIPPED" },
    { where: { id: shipping.get("orderId") } }
  );

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
const createDispatchRecords = async (
  orderIds: number[],
  shippingMedium: string,
  transaction: Transaction
) => {
  // Prepare a shipping record object for each order ID provided
  const shippingRecords = orderIds.map((orderId) => ({
    orderId,
    shippingMedium,
    status: "DISPATCHED" as const,
  }));

  // Use bulkCreate to insert all the new shipping records in a single, efficient database query
  await Shipping.bulkCreate(shippingRecords, { transaction });
};

export const ShippingServices = {
  createShippingDispatch,
  updateShippingStatusToShipped,
  createDispatchRecords,
};
