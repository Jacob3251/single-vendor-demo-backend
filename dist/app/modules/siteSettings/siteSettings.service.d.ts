import SiteSettings from "./siteSettings.model";
import type { BannerImage } from "./siteSettings.model";
export declare const getAllSettings: () => Promise<SiteSettings[]>;
export declare const getCurrentSettings: () => Promise<SiteSettings | null>;
export declare const updateSettings: (id: number, data: Partial<any>) => Promise<SiteSettings>;
export declare const createDefaultIfNone: () => Promise<SiteSettings | null>;
export declare const addBannerImage: (settingsId: number, bannerData: Omit<BannerImage, "id">) => Promise<SiteSettings>;
export declare const updateBannerImage: (settingsId: number, bannerId: number, bannerData: Partial<Omit<BannerImage, "id">>) => Promise<SiteSettings>;
export declare const deleteBannerImage: (settingsId: number, bannerId: number) => Promise<SiteSettings>;
//# sourceMappingURL=siteSettings.service.d.ts.map