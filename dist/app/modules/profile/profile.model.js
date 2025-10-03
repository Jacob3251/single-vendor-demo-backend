"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class Profile extends sequelize_1.Model {
}
Profile.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    addressLine1: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // 🔥 CHANGED: Allow null for Google sign-in users
    },
    addressLine2: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // 🔥 CHANGED: Allow null for Google sign-in users
    },
    county: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    postalCode: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // 🔥 CHANGED: Allow null for Google sign-in users
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    // This is the foreign key from the User model (Firebase UID)
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true, // Allow null for guest profiles created before login
        unique: true,
    },
    // 🔥 NEW: Add a field to track if profile is complete
    isComplete: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    modelName: "Profile",
    timestamps: true,
});
exports.default = Profile;
//# sourceMappingURL=profile.model.js.map