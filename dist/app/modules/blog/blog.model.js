"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../database"));
class Blog extends sequelize_1.Model {
}
Blog.init({
    id: { type: sequelize_1.DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    content: { type: sequelize_1.DataTypes.TEXT('long'), allowNull: false },
    featuredImage: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    featuredImageAlt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    slug: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    metaTitle: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    metaDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    metaKeyword: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    canonicalUrl: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    focusKeyword: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ogTitle: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    ogDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    ogImage: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    ogImageAlt: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    twitterTitle: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    twitterDescription: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    twitterImage: { type: sequelize_1.DataTypes.TEXT, allowNull: true },
    // ✅ FIX: Changed from UUID to STRING to match the User model.
    authorId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
}, {
    sequelize: database_1.default,
    modelName: "Blog",
    timestamps: true,
});
exports.default = Blog;
//# sourceMappingURL=blog.model.js.map