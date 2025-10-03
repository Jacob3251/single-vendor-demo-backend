import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class Shipping extends Model {
  public id!: number;
  public orderId!: number;
  public shippingMedium!: string; // e.g., 'Royal Mail', 'Evri'
  public trackingId!: string | null;
  public shippingTime!: Date | null; // The date it was actually shipped
  public status!: 'DISPATCHED' | 'SHIPPED';
}

Shipping.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Foreign key to the Order model
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, // Each order should have only one shipping entry
    },
    shippingMedium: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    trackingId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shippingTime: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('DISPATCHED', 'SHIPPED'),
      allowNull: false,
      defaultValue: 'DISPATCHED',
    },
  },
  {
    sequelize,
    modelName: "Shipping",
    timestamps: true, // createdAt will act as the dispatch time
  }
);

export default Shipping;