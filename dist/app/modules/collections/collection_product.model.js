"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class CollectionProduct extends sequelize_1.Model {
    collectionId;
    productId;
}
CollectionProduct.init({
    collectionId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'Collections', key: 'id' },
        onDelete: 'CASCADE',
    },
    productId: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        references: { model: 'Products', key: 'id' },
        onDelete: 'CASCADE',
    },
}, {
    sequelize: database_1.default,
    modelName: "CollectionProduct",
    tableName: "CollectionProducts", // Explicitly set table name
    timestamps: false,
});
exports.default = CollectionProduct;
//# sourceMappingURL=collection_product.model.js.map