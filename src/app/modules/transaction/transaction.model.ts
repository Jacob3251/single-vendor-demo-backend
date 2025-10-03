import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

// ✅ FIX: The public class fields have been removed.
// Sequelize will handle the properties automatically based on the .init() definition.
class Transaction extends Model {}

Transaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    transactionTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Transaction",
    timestamps: false,
  }
);

export default Transaction;
