"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class OrderProduct extends sequelize_1.Model {
}
OrderProduct.init({
    orderId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    productId: { type: sequelize_1.DataTypes.INTEGER, primaryKey: true },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
}, { sequelize: database_1.default, modelName: "OrderProduct", timestamps: false });
exports.default = OrderProduct;
//# sourceMappingURL=order_product.model.js.map