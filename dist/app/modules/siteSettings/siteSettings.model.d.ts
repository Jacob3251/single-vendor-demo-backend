import { Model, Optional } from "sequelize";
interface BannerImage {
    id: number;
    imgLink: string;
    altText: string;
}
interface SiteSettingsAttributes {
    id: number;
    bannerImages?: BannerImage[] | null;
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
declare class SiteSettings extends Model<SiteSettingsAttributes, CreationAttrs> implements SiteSettingsAttributes {
    id: number;
    bannerImages: BannerImage[] | null;
    metaTitle: string | null;
    metaDescription: string | null;
    metaKeywords: string | null;
    canonicalUrl: string | null;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    twitterTitle: string | null;
    twitterDescription: string | null;
    twitterImage: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default SiteSettings;
export type { BannerImage };
//# sourceMappingURL=siteSettings.model.d.ts.map