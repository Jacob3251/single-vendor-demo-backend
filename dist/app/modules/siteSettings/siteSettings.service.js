"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBannerImage = exports.updateBannerImage = exports.addBannerImage = exports.createDefaultIfNone = exports.updateSettings = exports.getCurrentSettings = exports.getAllSettings = void 0;
const siteSettings_model_1 = __importDefault(require("./siteSettings.model"));
const getAllSettings = async () => {
    return await siteSettings_model_1.default.findAll({ order: [["id", "ASC"]] });
};
exports.getAllSettings = getAllSettings;
const getCurrentSettings = async () => {
    return await siteSettings_model_1.default.findOne();
};
exports.getCurrentSettings = getCurrentSettings;
const updateSettings = async (id, data) => {
    const settings = await siteSettings_model_1.default.findByPk(id);
    if (!settings)
        throw new Error("Site settings not found");
    // Validate bannerImages if provided
    if (data.bannerImages !== undefined) {
        if (data.bannerImages !== null && !Array.isArray(data.bannerImages)) {
            throw new Error("bannerImages must be an array or null");
        }
        // Validate each banner object
        if (Array.isArray(data.bannerImages)) {
            for (const banner of data.bannerImages) {
                if (!banner.id || !banner.imgLink || !banner.altText) {
                    throw new Error("Each banner must have id, imgLink, and altText");
                }
                if (typeof banner.id !== "number") {
                    throw new Error("Banner id must be a number");
                }
                if (typeof banner.imgLink !== "string" || typeof banner.altText !== "string") {
                    throw new Error("Banner imgLink and altText must be strings");
                }
            }
        }
    }
    await settings.update(data);
    return settings;
};
exports.updateSettings = updateSettings;
const createDefaultIfNone = async () => {
    const count = await siteSettings_model_1.default.count();
    if (count === 0) {
        return await siteSettings_model_1.default.create({});
    }
    return null;
};
exports.createDefaultIfNone = createDefaultIfNone;
// Helper functions for banner image management
const addBannerImage = async (settingsId, bannerData) => {
    const settings = await siteSettings_model_1.default.findByPk(settingsId);
    if (!settings)
        throw new Error("Site settings not found");
    const currentBanners = settings.bannerImages || [];
    const newId = currentBanners.length > 0
        ? Math.max(...currentBanners.map(b => b.id)) + 1
        : 1;
    const newBanner = {
        id: newId,
        ...bannerData,
    };
    await settings.update({
        bannerImages: [...currentBanners, newBanner],
    });
    return settings;
};
exports.addBannerImage = addBannerImage;
const updateBannerImage = async (settingsId, bannerId, bannerData) => {
    const settings = await siteSettings_model_1.default.findByPk(settingsId);
    if (!settings)
        throw new Error("Site settings not found");
    const currentBanners = settings.bannerImages || [];
    const bannerIndex = currentBanners.findIndex(b => b.id === bannerId);
    if (bannerIndex === -1) {
        throw new Error("Banner not found");
    }
    currentBanners[bannerIndex] = {
        ...currentBanners[bannerIndex],
        ...bannerData,
    };
    await settings.update({ bannerImages: currentBanners });
    return settings;
};
exports.updateBannerImage = updateBannerImage;
const deleteBannerImage = async (settingsId, bannerId) => {
    const settings = await siteSettings_model_1.default.findByPk(settingsId);
    if (!settings)
        throw new Error("Site settings not found");
    const currentBanners = settings.bannerImages || [];
    const filteredBanners = currentBanners.filter(b => b.id !== bannerId);
    if (filteredBanners.length === currentBanners.length) {
        throw new Error("Banner not found");
    }
    await settings.update({ bannerImages: filteredBanners });
    return settings;
};
exports.deleteBannerImage = deleteBannerImage;
//# sourceMappingURL=siteSettings.service.js.map