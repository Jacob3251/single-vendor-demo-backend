"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsServices = void 0;
const sequelize_1 = require("sequelize");
const order_model_1 = __importDefault(require("../orders/order.model"));
const product_model_1 = __importDefault(require("../products/product.model"));
const order_product_model_1 = __importDefault(require("../orders/order_product.model"));
const date_fns_1 = require("date-fns");
/**
 * Calculates all the key metrics for the main dashboard.
 * @returns An object containing various dashboard statistics.
 */
const getDashboardStats = async () => {
    const now = new Date();
    // 1. Stat Card Metrics
    const unfulfilledOrders = await order_model_1.default.count({
        where: { fulfillmentStatus: 'PENDING' },
    });
    const dispatchedToday = await order_model_1.default.count({
        where: {
            fulfillmentStatus: 'DISPATCHED',
            updatedAt: { [sequelize_1.Op.gte]: (0, date_fns_1.startOfDay)(now) },
        },
    });
    const ordersToday = await order_model_1.default.count({
        where: {
            createdAt: { [sequelize_1.Op.gte]: (0, date_fns_1.startOfDay)(now) },
        },
    });
    const revenueThisMonth = await order_model_1.default.sum('total', {
        where: {
            payment_status: 'PAID',
            createdAt: { [sequelize_1.Op.gte]: (0, date_fns_1.startOfMonth)(now) },
        },
    });
    // 2. Best Sellers (Top 4 products by quantity sold)
    const bestSellersData = await order_product_model_1.default.findAll({
        attributes: [
            'productId',
            // ✅ FIX: Explicitly specify the table for the 'quantity' column
            // to resolve the ambiguity. We want to sum the quantity from the OrderProduct table.
            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('OrderProduct.quantity')), 'totalSold'],
        ],
        group: ['productId'],
        order: [[(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('OrderProduct.quantity')), 'DESC']],
        limit: 4,
        include: [{ model: product_model_1.default, as: 'product', attributes: ['name'] }],
    });
    const bestSellers = bestSellersData.map((item) => ({
        name: item.product ? item.product.name : 'Unknown Product',
        sales: parseInt(item.get('totalSold'), 10),
    }));
    // 3. Monthly Sales Chart (Sales for the last 6 months)
    const sixMonthsAgo = (0, date_fns_1.subMonths)(now, 5);
    const monthlySalesRaw = await order_model_1.default.findAll({
        where: {
            payment_status: 'PAID',
            createdAt: { [sequelize_1.Op.gte]: (0, date_fns_1.startOfMonth)(sixMonthsAgo) },
        },
        attributes: [
            [(0, sequelize_1.fn)('SUM', (0, sequelize_1.col)('total')), 'sales'],
            [(0, sequelize_1.fn)('MONTHNAME', (0, sequelize_1.col)('createdAt')), 'month'], // Note: MONTHNAME is MySQL-specific
            [(0, sequelize_1.fn)('YEAR', (0, sequelize_1.col)('createdAt')), 'year'],
            [(0, sequelize_1.fn)('MONTH', (0, sequelize_1.col)('createdAt')), 'month_numeric'],
        ],
        group: [
            'year',
            'month',
            'month_numeric'
        ],
        order: [
            ['year', 'ASC'],
            ['month_numeric', 'ASC']
        ],
        raw: true,
    });
    const salesData = monthlySalesRaw.map((entry) => ({
        name: entry.month.substring(0, 3),
        sales: parseFloat(entry.sales),
    }));
    return {
        stats: {
            unfulfilledOrders,
            dispatchedToday,
            ordersToday,
            revenueThisMonth: revenueThisMonth || 0,
        },
        bestSellers,
        salesData,
    };
};
exports.StatsServices = {
    getDashboardStats,
};
//# sourceMappingURL=stats.service.js.map