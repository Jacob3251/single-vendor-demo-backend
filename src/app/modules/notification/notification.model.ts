import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class Notification extends Model {
  public id!: number;
  public type!: 'NEW_ORDER' | 'LOW_STOCK' | 'NEW_USER';
  public message!: string;
  public isRead!: boolean;
  public entityId!: number; // e.g., the ID of the order or product
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('NEW_ORDER', 'LOW_STOCK', 'NEW_USER'),
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // A generic ID to link the notification to another record (e.g., an Order)
    entityId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Notification",
    timestamps: true,
  }
);

export default Notification;
