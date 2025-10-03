"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderServices = void 0;
const order_model_1 = __importDefault(require("./order.model"));
const product_model_1 = __importDefault(require("../products/product.model"));
const profile_model_1 = __importDefault(require("../profile/profile.model"));
const order_product_model_1 = __importDefault(require("./order_product.model"));
const database_1 = __importDefault(require("../../database"));
const sequelize_1 = require("sequelize");
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const profile_service_1 = require("../profile/profile.service");
const email_service_1 = require("../../utils/email.service");
const json2csv_1 = require("json2csv");
const shipping_model_1 = __importDefault(require("../shipping/shipping.model"));
const shipping_service_1 = require("../shipping/shipping.service");
/**
 * Creates a manual order, including transaction and profile records.
 */
const createManualOrderInDB = async (payload) => {
    return database_1.default.transaction(async (t) => {
        const newTransaction = await transaction_model_1.default.create({ transactionId: payload.transactionId }, { transaction: t });
        const profile = await profile_service_1.ProfileServices.updateOrCreateProfile(null, payload.profile, payload.profile.email, t);
        const total_items = payload.products.reduce((sum, p) => sum + p.quantity, 0);
        const total_amount = payload.products.reduce((sum, p) => sum + Number(p.price) * p.quantity, 0);
        const total_weight = payload.products.reduce((sum, p) => sum + (Number(p.weight) || 0) * p.quantity, 0);
        const orderPayload = {
            order_no: Date.now(),
            total: total_amount,
            payment_status: "PAID",
            fulfillmentStatus: "PENDING",
            total_items,
            deliveryMethod: payload.deliveryMethod,
            weight: total_weight,
            profileId: profile.get("id"),
            transactionId: newTransaction.get("id"),
            shippingCost: 0,
        };
        const order = await order_model_1.default.create(orderPayload, { transaction: t });
        const orderProducts = payload.products.map((p) => ({
            orderId: order.get("id"),
            productId: p.productId,
            quantity: p.quantity,
        }));
        await order_product_model_1.default.bulkCreate(orderProducts, { transaction: t });
        return order;
    });
};
/**
 * Creates an order from a Stripe webhook payload.
 */
const createOrderInDB = async (payload, options) => {
    const { products, ...orderData } = payload;
    const order = await order_model_1.default.create(orderData, {
        transaction: options.transaction,
    });
    const orderProducts = products.map((p) => ({
        orderId: order.get("id"),
        productId: p.productId,
        quantity: p.quantity,
    }));
    await order_product_model_1.default.bulkCreate(orderProducts, {
        transaction: options.transaction,
    });
    return order;
};
/**
 * Retrieves all orders for the admin dashboard with robust filtering and searching.
 */
const getAllOrdersFromDB = async (options) => {
    const { searchTerm, status, page = 1, limit = 10 } = options;
    const whereClause = {};
    if (status && status !== "ALL") {
        whereClause.fulfillmentStatus = status;
    }
    if (searchTerm) {
        whereClause[sequelize_1.Op.or] = [
            { order_no: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
            { "$profile.firstName$": { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
            { "$profile.lastName$": { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
            { "$profile.email$": { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
        ];
    }
    const { count, rows } = await order_model_1.default.findAndCountAll({
        where: whereClause,
        include: [
            { model: profile_model_1.default, as: "profile" },
            { model: product_model_1.default, as: "products", through: { attributes: ["quantity"] } },
            { model: shipping_model_1.default, as: "shippingDetails" },
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
const getOrderByIdFromDB = async (id) => {
    return order_model_1.default.findByPk(id, {
        include: [
            { model: product_model_1.default, as: "products", through: { attributes: ["quantity"] } },
            { model: profile_model_1.default, as: "profile" },
            { model: shipping_model_1.default, as: "shippingDetails" },
        ],
    });
};
/**
 * Retrieves all orders for a specific user.
 */
const getOrdersByUserId = async (userId) => {
    const profile = await profile_model_1.default.findOne({ where: { userId } });
    if (!profile)
        return [];
    return order_model_1.default.findAll({
        where: { profileId: profile.get("id") },
        order: [["date", "DESC"]],
        include: [{ model: product_model_1.default, as: "products" }],
    });
};
/**
 * Retrieves a single order by its associated transaction ID.
 */
const getOrderByTransactionId = async (transactionId) => {
    return order_model_1.default.findOne({
        where: { transactionId },
        include: [{ model: profile_model_1.default, as: "profile" }],
    });
};
/**
 * Central function for updating an order's details and its associated shipping record.
 */
const updateOrderInDB = async (id, payload) => {
    const t = await database_1.default.transaction();
    try {
        const order = await order_model_1.default.findByPk(id, { transaction: t });
        if (!order)
            throw new Error("Order not found");
        await order.update(payload, { transaction: t });
        if (payload.deliveryCompany) {
            const shipping = await shipping_model_1.default.findOne({
                where: { orderId: id },
                transaction: t,
            });
            if (shipping) {
                await shipping.update({
                    shippingMedium: payload.deliveryCompany,
                }, { transaction: t });
            }
        }
        await t.commit();
        return order;
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
/**
 * Updates the fulfillment status for multiple orders and creates shipping records.
 */
const bulkUpdateOrderStatus = async (orderIds, status, shippingMedium = "Royal Mail") => {
    const t = await database_1.default.transaction();
    try {
        const requiredCurrentStatus = status === "DISPATCHED" ? "PENDING" : "DISPATCHED";
        const [updatedRowCount] = await order_model_1.default.update({ fulfillmentStatus: status }, {
            where: {
                id: { [sequelize_1.Op.in]: orderIds },
                fulfillmentStatus: requiredCurrentStatus,
            },
            transaction: t,
        });
        if (updatedRowCount === 0) {
            throw new Error(`No orders were updated. Please ensure they are in the correct status ('${requiredCurrentStatus}').`);
        }
        if (status === "DISPATCHED") {
            await shipping_service_1.ShippingServices.createDispatchRecords(orderIds, shippingMedium, t);
            const updatedOrders = await order_model_1.default.findAll({
                where: { id: { [sequelize_1.Op.in]: orderIds } },
                include: [{ model: profile_model_1.default, as: "profile", required: true }],
                transaction: t,
            });
            for (const order of updatedOrders) {
                // ✅ FIX: Access the included 'profile' as a direct property, not with .get()
                const profile = order.profile;
                if (profile) {
                    await email_service_1.EmailServices.sendDispatchNotification(order, profile);
                }
                else {
                    console.warn(`Could not find profile for order ID ${order.get("id")} while sending dispatch email.`);
                }
            }
        }
        await t.commit();
        return { message: `${updatedRowCount} orders updated to ${status}.` };
    }
    catch (error) {
        await t.rollback();
        throw error;
    }
};
/**
 * Generates a CSV manifest for a list of shipped orders.
 */
const generateShippingCsv = async (orderIds) => {
    const orders = await order_model_1.default.findAll({
        where: { id: { [sequelize_1.Op.in]: orderIds }, fulfillmentStatus: "SHIPPED" },
        include: [
            { model: profile_model_1.default, as: "profile", required: true },
            { model: product_model_1.default, as: "products", through: { attributes: ["quantity"] } },
            { model: shipping_model_1.default, as: "shippingDetails", required: true },
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
        const profile = order.profile;
        const products = order.products;
        const shipping = order.shippingDetails;
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
    const parser = new json2csv_1.Parser({ fields });
    return parser.parse(data);
};
/**
 * Sends a delivery notification email for a specific order.
 */
const sendDeliveryEmail = async (orderId) => {
    const order = await order_model_1.default.findByPk(orderId, {
        include: [
            { model: profile_model_1.default, as: "profile", required: true },
            { model: shipping_model_1.default, as: "shippingDetails", required: true },
        ],
    });
    if (!order)
        throw new Error("Order not found.");
    if (!order.get("trackingId"))
        throw new Error("Tracking ID is missing for this order. Please add it first.");
    await email_service_1.EmailServices.sendDeliveryNotification(order, order.profile, order.shippingDetails);
    return { message: "Delivery email sent successfully." };
};
exports.OrderServices = {
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
//# sourceMappingURL=order.service.js.map