import Order from "./order.model";
import Product from "../products/product.model";
import Profile from "../profile/profile.model";
import OrderProduct from "./order_product.model";
import sequelize from "../../database";
import { Op } from "sequelize";
import { Transaction as SequelizeTransaction } from "sequelize";
import TransactionModel from "../transaction/transaction.model";
import { ProfileServices } from "../profile/profile.service";
import { EmailServices } from "../../utils/email.service";
import { Parser } from "json2csv";
import Shipping from "../shipping/shipping.model";
import { ShippingServices } from "../shipping/shipping.service";

// Interface for the data needed to update an order's fulfillment details
interface UpdateOrderPayload {
  fulfillmentStatus?: "PENDING" | "DISPATCHED" | "SHIPPED";
  trackingId?: string | null;
  emailStatus?: "ConfirmOrder" | "ShippingDetails" | "Delivery";
  weight?: number;
  deliveryCompany?: string;
}

// Interface for the data needed to create a manual order by an admin
interface ManualOrderPayload {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
  };
  transactionId: string;
  products: {
    productId: number;
    quantity: number;
    price: number;
    weight: number;
  }[];
  deliveryMethod: string;
}

/**
 * Creates a manual order, including transaction and profile records.
 */
const createManualOrderInDB = async (payload: ManualOrderPayload) => {
  return sequelize.transaction(async (t) => {
    const newTransaction = await TransactionModel.create(
      { transactionId: payload.transactionId },
      { transaction: t }
    );
    const profile = await ProfileServices.updateOrCreateProfile(
      null,
      payload.profile,
      payload.profile.email,
      t
    );
    const total_items = payload.products.reduce(
      (sum, p) => sum + p.quantity,
      0
    );
    const total_amount = payload.products.reduce(
      (sum, p) => sum + Number(p.price) * p.quantity,
      0
    );
    const total_weight = payload.products.reduce(
      (sum, p) => sum + (Number(p.weight) || 0) * p.quantity,
      0
    );
    const orderPayload = {
      order_no: Date.now(),
      total: total_amount,
      payment_status: "PAID" as const,
      fulfillmentStatus: "PENDING" as const,
      total_items,
      deliveryMethod: payload.deliveryMethod,
      weight: total_weight,
      profileId: profile.get("id") as number,
      transactionId: newTransaction.get("id") as number,
      shippingCost: 0,
    };
    const order = await Order.create(orderPayload, { transaction: t });
    const orderProducts = payload.products.map((p) => ({
      orderId: order.get("id") as number,
      productId: p.productId,
      quantity: p.quantity,
    }));
    await OrderProduct.bulkCreate(orderProducts, { transaction: t });
    return order;
  });
};

/**
 * Creates an order from a Stripe webhook payload.
 */
const createOrderInDB = async (
  payload: any,
  options: { transaction: SequelizeTransaction }
) => {
  const { products, ...orderData } = payload;
  const order = await Order.create(orderData, {
    transaction: options.transaction,
  });
  const orderProducts = products.map((p: any) => ({
    orderId: order.get("id") as number,
    productId: p.productId,
    quantity: p.quantity,
  }));
  await OrderProduct.bulkCreate(orderProducts, {
    transaction: options.transaction,
  });
  return order;
};

/**
 * Retrieves all orders for the admin dashboard with robust filtering and searching.
 */
const getAllOrdersFromDB = async (options: {
  searchTerm?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const { searchTerm, status, page = 1, limit = 10 } = options;

  const whereClause: any = {};

  if (status && status !== "ALL") {
    whereClause.fulfillmentStatus = status;
  }

  if (searchTerm) {
    whereClause[Op.or] = [
      { order_no: { [Op.iLike]: `%${searchTerm}%` } },
      { "$profile.firstName$": { [Op.iLike]: `%${searchTerm}%` } },
      { "$profile.lastName$": { [Op.iLike]: `%${searchTerm}%` } },
      { "$profile.email$": { [Op.iLike]: `%${searchTerm}%` } },
    ];
  }

  const { count, rows } = await Order.findAndCountAll({
    where: whereClause,
    include: [
      { model: Profile, as: "profile" },
      { model: Product, as: "products", through: { attributes: ["quantity"] } },
      { model: Shipping, as: "shippingDetails" },
    ],
    order: [["date", "DESC"]],
    limit,
    offset: (page - 1) * limit,
    distinct: true,
    subQuery: false,
  });

  return {
    orders: rows,
    meta: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
  };
};

/**
 * Retrieves a single order by its ID for an admin.
 */
const getOrderByIdFromDB = async (id: number) => {
  return Order.findByPk(id, {
    include: [
      { model: Product, as: "products", through: { attributes: ["quantity"] } },
      { model: Profile, as: "profile" },
      { model: Shipping, as: "shippingDetails" },
    ],
  });
};

/**
 * Retrieves all orders for a specific user.
 */
const getOrdersByUserId = async (userId: string) => {
  const profile = await Profile.findOne({ where: { userId } });
  if (!profile) return [];
  return Order.findAll({
    where: { profileId: profile.get("id") as number },
    order: [["date", "DESC"]],
    include: [{ model: Product, as: "products" }],
  });
};

/**
 * Retrieves a single order by its associated transaction ID.
 */
const getOrderByTransactionId = async (transactionId: number) => {
  return Order.findOne({
    where: { transactionId },
    include: [{ model: Profile, as: "profile" }],
  });
};

/**
 * Central function for updating an order's details and its associated shipping record.
 */
const updateOrderInDB = async (id: number, payload: UpdateOrderPayload) => {
  const t = await sequelize.transaction();
  try {
    const order = await Order.findByPk(id, { transaction: t });
    if (!order) throw new Error("Order not found");

    await order.update(payload, { transaction: t });

    if (payload.deliveryCompany) {
      const shipping = await Shipping.findOne({
        where: { orderId: id },
        transaction: t,
      });
      if (shipping) {
        await shipping.update(
          {
            shippingMedium: payload.deliveryCompany,
          },
          { transaction: t }
        );
      }
    }

    await t.commit();
    return order;
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Updates the fulfillment status for multiple orders and creates shipping records.
 */
const bulkUpdateOrderStatus = async (
  orderIds: number[],
  status: "DISPATCHED" | "SHIPPED",
  shippingMedium: string = "Royal Mail"
) => {
  const t = await sequelize.transaction();
  try {
    const requiredCurrentStatus =
      status === "DISPATCHED" ? "PENDING" : "DISPATCHED";
    const [updatedRowCount] = await Order.update(
      { fulfillmentStatus: status },
      {
        where: {
          id: { [Op.in]: orderIds },
          fulfillmentStatus: requiredCurrentStatus,
        },
        transaction: t,
      }
    );

    if (updatedRowCount === 0) {
      throw new Error(
        `No orders were updated. Please ensure they are in the correct status ('${requiredCurrentStatus}').`
      );
    }

    if (status === "DISPATCHED") {
      await ShippingServices.createDispatchRecords(orderIds, shippingMedium, t);
      const updatedOrders = await Order.findAll({
        where: { id: { [Op.in]: orderIds } },
        include: [{ model: Profile, as: "profile", required: true }],
        transaction: t,
      });
      for (const order of updatedOrders) {
        // ✅ FIX: Access the included 'profile' as a direct property, not with .get()
        const profile = (order as any).profile as Profile;
        if (profile) {
          await EmailServices.sendDispatchNotification(order, profile);
        } else {
          console.warn(
            `Could not find profile for order ID ${order.get(
              "id"
            )} while sending dispatch email.`
          );
        }
      }
    }
    await t.commit();
    return { message: `${updatedRowCount} orders updated to ${status}.` };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * Generates a CSV manifest for a list of shipped orders.
 */
const generateShippingCsv = async (orderIds: number[]) => {
  const orders = await Order.findAll({
    where: { id: { [Op.in]: orderIds }, fulfillmentStatus: "SHIPPED" },
    include: [
      { model: Profile, as: "profile", required: true },
      { model: Product, as: "products", through: { attributes: ["quantity"] } },
      { model: Shipping, as: "shippingDetails", required: true },
    ],
  });

  if (orders.length === 0) {
    throw new Error("No valid shipped orders found for CSV generation.");
  }

  const fields = [
    "Item Name",
    "Value",
    "Weight",
    "Length",
    "Width",
    "Height",
    "Name",
    "Property",
    "Street",
    "Town",
    "County",
    "PostCode",
    "Country",
    "Telephone",
    "Courier",
  ];
  const data = orders.map((order) => {
    const profile = (order as any).profile as any;
    const products = (order as any).products as any[];
    const shipping = (order as any).shippingDetails as any;
    return {
      "Item Name": products
        .map((p) => `${p.OrderProduct.quantity}x ${p.name}`)
        .join(" | "),
      Value: order.get("total"),
      Weight: order.get("weight"),
      Length: 10,
      Width: 10,
      Height: 10,
      Name: `${profile.firstName} ${profile.lastName}`,
      Property: profile.addressLine1,
      Street: profile.addressLine2 || "",
      Town: profile.city,
      County: profile.county || "",
      PostCode: profile.postalCode,
      Country: "United Kingdom",
      Telephone: profile.phoneNumber,
      Courier: shipping.shippingMedium,
    };
  });

  const parser = new Parser({ fields });
  return parser.parse(data);
};

/**
 * Sends a delivery notification email for a specific order.
 */
const sendDeliveryEmail = async (orderId: number) => {
  const order = await Order.findByPk(orderId, {
    include: [
      { model: Profile, as: "profile", required: true },
      { model: Shipping, as: "shippingDetails", required: true },
    ],
  });
  if (!order) throw new Error("Order not found.");
  if (!order.get("trackingId"))
    throw new Error(
      "Tracking ID is missing for this order. Please add it first."
    );

  await EmailServices.sendDeliveryNotification(
    order,
    (order as any).profile as Profile,
    (order as any).shippingDetails as Shipping
  );
  return { message: "Delivery email sent successfully." };
};

export const OrderServices = {
  createManualOrderInDB,
  createOrderInDB,
  getAllOrdersFromDB,
  getOrderByIdFromDB,
  getOrdersByUserId,
  getOrderByTransactionId,
  updateOrderInDB,
  bulkUpdateOrderStatus,
  generateShippingCsv,
  sendDeliveryEmail,
};
