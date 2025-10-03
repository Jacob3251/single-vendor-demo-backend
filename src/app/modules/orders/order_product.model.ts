import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class OrderProduct extends Model {
  declare orderId: number;
  declare productId: number;
  declare quantity: number;
}

OrderProduct.init(
  {
    orderId: { type: DataTypes.INTEGER, primaryKey: true },
    productId: { type: DataTypes.INTEGER, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  },
  { sequelize, modelName: "OrderProduct", timestamps: false }
);

export default OrderProduct;
