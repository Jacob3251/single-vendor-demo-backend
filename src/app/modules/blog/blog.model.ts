import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

class Blog extends Model {}

Blog.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT('long'), allowNull: false },
    featuredImage: { type: DataTypes.TEXT, allowNull: true },
    featuredImageAlt: { type: DataTypes.STRING, allowNull: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    metaTitle: { type: DataTypes.STRING, allowNull: true },
    metaDescription: { type: DataTypes.TEXT, allowNull: true },
    metaKeyword: { type: DataTypes.TEXT, allowNull: true },
    canonicalUrl: { type: DataTypes.STRING, allowNull: true },
    focusKeyword: { type: DataTypes.STRING, allowNull: true },
    ogTitle: { type: DataTypes.STRING, allowNull: true },
    ogDescription: { type: DataTypes.TEXT, allowNull: true },
    ogImage: { type: DataTypes.TEXT, allowNull: true },
    ogImageAlt: { type: DataTypes.STRING, allowNull: true },
    twitterTitle: { type: DataTypes.STRING, allowNull: true },
    twitterDescription: { type: DataTypes.TEXT, allowNull: true },
    twitterImage: { type: DataTypes.TEXT, allowNull: true },
    // ✅ FIX: Changed from UUID to STRING to match the User model.
    authorId: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    modelName: "Blog",
    timestamps: true,
  }
);

export default Blog;
