import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class CollectionProduct extends Model {
  public collectionId!: number;
  public productId!: number;
}

CollectionProduct.init(
  {
    collectionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Collections', key: 'id' },
      onDelete: 'CASCADE',
    },
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'Products', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: "CollectionProduct",
    tableName: "CollectionProducts", // Explicitly set table name
    timestamps: false,
  }
);

export default CollectionProduct;