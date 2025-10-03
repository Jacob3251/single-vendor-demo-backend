import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

// ✅ Add this detailed logging
console.log("=== BRAND MODEL DEBUG ===");
console.log("Sequelize dialect:", sequelize.getDialect());
console.log("Sequelize config:", sequelize.config);
console.log("========================");

class Brand extends Model {
  public id!: number;
  public name!: string;
  public status!: "ACTIVE" | "INACTIVE";
  public description!: string | null;
  public image!: string | null;
}

Brand.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM("ACTIVE", "INACTIVE"), defaultValue: "ACTIVE" },
    description: { type: DataTypes.TEXT, allowNull: true },
    image: { type: DataTypes.TEXT, allowNull: true },
  },
  {
    sequelize,
    modelName: "Brand",
    timestamps: true,
  }
);

export default Brand;