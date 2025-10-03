"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class Collection extends sequelize_1.Model {
}
Collection.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    slug: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true }, // ✅ NEW FIELD
    image: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    status: { type: sequelize_1.DataTypes.ENUM("ACTIVE", "INACTIVE"), defaultValue: "ACTIVE" },
    order: { type: sequelize_1.DataTypes.INTEGER, defaultValue: 0, allowNull: false },
}, {
    sequelize: database_1.default,
    modelName: "Collection",
    timestamps: true,
});
exports.default = Collection;
//# sourceMappingURL=collection.model.js.map