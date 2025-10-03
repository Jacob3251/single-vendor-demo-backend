"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
// ✅ Add this detailed logging
console.log("=== BRAND MODEL DEBUG ===");
console.log("Sequelize dialect:", database_1.default.getDialect());
console.log("Sequelize config:", database_1.default.config);
console.log("========================");
class Brand extends sequelize_1.Model {
    id;
    name;
    status;
    description;
    image;
}
Brand.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM("ACTIVE", "INACTIVE"), defaultValue: "ACTIVE" },
    description: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    image: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
}, {
    sequelize: database_1.default,
    modelName: "Brand",
    timestamps: true,
});
exports.default = Brand;
//# sourceMappingURL=brand.model.js.map