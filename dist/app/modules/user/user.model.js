"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class User extends sequelize_1.Model {
}
User.init({
    userId: {
        // This is the Firebase UID, which is a string.
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
    },
    userType: {
        type: sequelize_1.DataTypes.ENUM("ADMIN", "SEO", "GUEST"),
        allowNull: false,
        defaultValue: "GUEST",
    },
}, {
    sequelize: database_1.default,
    modelName: "User",
    timestamps: true,
});
exports.default = User;
//# sourceMappingURL=user.model.js.map