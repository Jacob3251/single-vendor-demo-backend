import SiteSettings from "./siteSettings.model";
export declare const getAllSettings: () => Promise<SiteSettings[]>;
export declare const getCurrentSettings: () => Promise<SiteSettings | null>;
export declare const updateSettings: (id: number, data: Partial<any>) => Promise<SiteSettings>;
export declare const createDefaultIfNone: () => Promise<SiteSettings | null>;
//# sourceMappingURL=siteSettings.service.d.ts.map