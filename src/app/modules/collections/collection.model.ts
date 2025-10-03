import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class Collection extends Model {}

Collection.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true }, // ✅ NEW FIELD
    image: { type: DataTypes.TEXT, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.ENUM("ACTIVE", "INACTIVE"), defaultValue: "ACTIVE" },
    order: { type: DataTypes.INTEGER, defaultValue: 0, allowNull: false },
  },
  {
    sequelize,
    modelName: "Collection",
    timestamps: true,
  }
);

export default Collection;
