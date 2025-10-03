// siteSettings.model.ts
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../../database";

interface SiteSettingsAttributes {
  id: number;
  bannerImgLink?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: string | null;
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  twitterTitle?: string | null;
  twitterDescription?: string | null;
  twitterImage?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type CreationAttrs = Optional<SiteSettingsAttributes, "id">;

class SiteSettings extends Model<SiteSettingsAttributes, CreationAttrs>
  implements SiteSettingsAttributes {
  public id!: number;
  public bannerImgLink!: string | null;
  public metaTitle!: string | null;
  public metaDescription!: string | null;
  public metaKeywords!: string | null;
  public canonicalUrl!: string | null;
  public ogTitle!: string | null;
  public ogDescription!: string | null;
  public ogImage!: string | null;
  public twitterTitle!: string | null;
  public twitterDescription!: string | null;
  public twitterImage!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

SiteSettings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bannerImgLink: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    metaTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    metaDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    metaKeywords: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    canonicalUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    ogTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    ogDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    ogImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    twitterTitle: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    twitterDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    twitterImage: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    modelName: "SiteSettings",
    tableName: "site_settings",
    timestamps: true,
  }
);

export default SiteSettings;
