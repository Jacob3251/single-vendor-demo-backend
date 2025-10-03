"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class Product extends sequelize_1.Model {
}
Product.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    price: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false },
    compare_at_price: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: true },
    // ✅ FIX: Removed the unique constraint from the barcode field.
    // This will free up an index and resolve the "Too many keys" error.
    barcode: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    rating: { type: sequelize_1.DataTypes.INTEGER, validate: { min: 1, max: 5 }, allowNull: true },
    weight: { type: sequelize_1.DataTypes.DECIMAL(10, 2), allowNull: false, comment: "Weight in kg" },
    quantity: { type: sequelize_1.DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: { type: sequelize_1.DataTypes.ENUM("ACTIVE", "DRAFT"), defaultValue: "DRAFT" },
    type: {
        type: sequelize_1.DataTypes.ENUM("LOTION", "OIL", "SOAP", "SHAMPOO", "CONDITIONER", "MASQUE", "SCRUB", "LIQUID", "MOUSSE", "GEL", "CREAM", "SERUM", "CORRECTOR", "TUBE"),
        allowNull: false,
    },
    brandId: { type: sequelize_1.DataTypes.INTEGER, allowNull: true },
    image: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    slug: { type: sequelize_1.DataTypes.STRING, allowNull: true, unique: true },
    metaTitle: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    metaDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    metaKeywords: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    canonicalUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    focusKeyword: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    readingTime: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, comment: "In minutes" },
    seoScore: { type: sequelize_1.DataTypes.INTEGER, allowNull: true, validate: { min: 0, max: 100 } },
}, {
    sequelize: database_1.default,
    modelName: "Product",
    timestamps: true,
});
exports.default = Product;
//# sourceMappingURL=product.model.js.map