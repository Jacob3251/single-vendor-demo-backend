import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class Product extends Model {}

Product.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    compare_at_price: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    
    // ✅ FIX: Removed the unique constraint from the barcode field.
    // This will free up an index and resolve the "Too many keys" error.
    barcode: { type: DataTypes.STRING, allowNull: true },
    
    rating: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 }, allowNull: true },
    weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false, comment: "Weight in kg" },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.ENUM("ACTIVE", "DRAFT"), defaultValue: "DRAFT" },
    type: {
      type: DataTypes.ENUM("LOTION", "OIL", "SOAP", "SHAMPOO", "CONDITIONER", "MASQUE", "SCRUB", "LIQUID", "MOUSSE", "GEL", "CREAM", "SERUM", "CORRECTOR", "TUBE"),
      allowNull: false,
    },
    brandId: { type: DataTypes.INTEGER, allowNull: true },
    image: { type: DataTypes.TEXT, allowNull: true },
    slug: { type: DataTypes.STRING, allowNull: true, unique: true },
    metaTitle: { type: DataTypes.STRING, allowNull: true },
    metaDescription: { type: DataTypes.TEXT, allowNull: true },
    metaKeywords: { type: DataTypes.TEXT, allowNull: true },
    canonicalUrl: { type: DataTypes.STRING, allowNull: true },
    focusKeyword: { type: DataTypes.STRING, allowNull: true },
    readingTime: { type: DataTypes.INTEGER, allowNull: true, comment: "In minutes" },
    seoScore: { type: DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 100 } },
  },
  {
    sequelize,
    modelName: "Product",
    timestamps: true,
  }
);

export default Product;
