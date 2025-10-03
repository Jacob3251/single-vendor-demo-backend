"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class Shipping extends sequelize_1.Model {
    id;
    orderId;
    shippingMedium; // e.g., 'Royal Mail', 'Evri'
    trackingId;
    shippingTime; // The date it was actually shipped
    status;
}
Shipping.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    // Foreign key to the Order model
    orderId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Each order should have only one shipping entry
    },
    shippingMedium: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    trackingId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    shippingTime: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('DISPATCHED', 'SHIPPED'),
        allowNull: false,
        defaultValue: 'DISPATCHED',
    },
}, {
    sequelize: database_1.default,
    modelName: "Shipping",
    timestamps: true, // createdAt will act as the dispatch time
});
exports.default = Shipping;
//# sourceMappingURL=shipping.model.js.map