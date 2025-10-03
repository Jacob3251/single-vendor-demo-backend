"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// siteSettings.model.ts
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class SiteSettings extends sequelize_1.Model {
    id;
    bannerImgLink;
    metaTitle;
    metaDescription;
    metaKeywords;
    canonicalUrl;
    ogTitle;
    ogDescription;
    ogImage;
    twitterTitle;
    twitterDescription;
    twitterImage;
    createdAt;
    updatedAt;
}
SiteSettings.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bannerImgLink: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    metaTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    metaDescription: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    metaKeywords: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    canonicalUrl: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    ogTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    ogDescription: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    ogImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    twitterTitle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    twitterDescription: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
    },
    twitterImage: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
}, {
    sequelize: database_1.default,
    modelName: "SiteSettings",
    tableName: "site_settings",
    timestamps: true,
});
exports.default = SiteSettings;
//# sourceMappingURL=siteSettings.model.js.map