import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class Order extends Model {}

Order.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_no: { type: DataTypes.BIGINT, allowNull: false, unique: true },
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    shippingCost: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    payment_status: { type: DataTypes.ENUM("PAID", "PENDING"), defaultValue: "PENDING" },
    fulfillmentStatus: { type: DataTypes.ENUM("PENDING", "DISPATCHED", "SHIPPED"), defaultValue: "PENDING" },
    total_items: { type: DataTypes.INTEGER, allowNull: false },
    deliveryMethod: { type: DataTypes.STRING, allowNull: false },
    trackingId: { type: DataTypes.STRING, allowNull: true },
    weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: "Total weight of order in kg" },
    profileId: { type: DataTypes.INTEGER, allowNull: false }, // <-- Renamed from customerId
    emailStatus: { type: DataTypes.ENUM("ConfirmOrder", "ShippingDetails", "Delivery"), defaultValue: "ConfirmOrder" },
    transactionId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  },
  {
    sequelize,
    modelName: "Order",
    timestamps: true,
  }
);

export default Order;
