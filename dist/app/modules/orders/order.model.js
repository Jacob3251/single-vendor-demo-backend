"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class Order extends sequelize_1.Model {
}
Order.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_no: { type: sequelize_1.DataTypes.BIGINT, allowNull: false, unique: true },
    date: { type: sequelize_1.DataTypes.DATE, defaultValue: sequelize_1.DataTypes.NOW },
    total: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    shippingCost: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    payment_status: { type: sequelize_1.DataTypes.ENUM("PAID", "PENDING"), defaultValue: "PENDING" },
    fulfillmentStatus: { type: sequelize_1.DataTypes.ENUM("PENDING", "DISPATCHED", "SHIPPED"), defaultValue: "PENDING" },
    total_items: { type: sequelize_1.DataTypes.INTEGER, allowNull: false },
    deliveryMethod: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    trackingId: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    weight: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false, comment: "Total weight of order in kg" },
    profileId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false }, // <-- Renamed from customerId
    emailStatus: { type: sequelize_1.DataTypes.ENUM("ConfirmOrder", "ShippingDetails", "Delivery"), defaultValue: "ConfirmOrder" },
    transactionId: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, unique: true },
}, {
    sequelize: database_1.default,
    modelName: "Order",
    timestamps: true,
});
exports.default = Order;
//# sourceMappingURL=order.model.js.map