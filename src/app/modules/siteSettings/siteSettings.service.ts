import SiteSettings from "./siteSettings.model";
import type { BannerImage } from "./siteSettings.model";

export const getAllSettings = async () => {
  return await SiteSettings.findAll({ order: [["id", "ASC"]] });
};

export const getCurrentSettings = async () => {
  return await SiteSettings.findOne();
};

// Modified to handle both create and update
export const updateSettings = async (id: number, data: Partial<any>) => {
  let settings = await SiteSettings.findByPk(id);
  
  // If settings don't exist, create them with the specified ID
  if (!settings) {
    settings = await SiteSettings.create({
      id: id,
      ...data
    });
    return settings;
  }
  
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
  
  // Update existing settings
  await settings.update(data);
  return settings;
};

export const createDefaultIfNone = async () => {
  const count = await SiteSettings.count();
  if (count === 0) {
    return await SiteSettings.create({});
  }
  return null;
};

// Helper functions for banner image management
export const addBannerImage = async (
  settingsId: number,
  bannerData: Omit<BannerImage, "id">
) => {
  const settings = await SiteSettings.findByPk(settingsId);
  if (!settings) throw new Error("Site settings not found");

  const currentBanners = settings.bannerImages || [];
  const newId = currentBanners.length > 0 
    ? Math.max(...currentBanners.map(b => b.id)) + 1 
    : 1;

  const newBanner: BannerImage = {
    id: newId,
    ...bannerData,
  };

  await settings.update({
    bannerImages: [...currentBanners, newBanner],
  });

  return settings;
};

export const updateBannerImage = async (
  settingsId: number,
  bannerId: number,
  bannerData: Partial<Omit<BannerImage, "id">>
) => {
  const settings = await SiteSettings.findByPk(settingsId);
  if (!settings) throw new Error("Site settings not found");

  const currentBanners = settings.bannerImages || [];
  const bannerIndex = currentBanners.findIndex(b => b.id === bannerId);
  
  if (bannerIndex === -1) {
    throw new Error("Banner not found");
  }

  const existingBanner = currentBanners[bannerIndex];
  if (!existingBanner) {
    throw new Error("Banner not found");
  }

  const updatedBanner: BannerImage = {
    id: existingBanner.id,
    imgLink: bannerData.imgLink ?? existingBanner.imgLink,
    altText: bannerData.altText ?? existingBanner.altText,
  };

  currentBanners[bannerIndex] = updatedBanner;

  await settings.update({ bannerImages: currentBanners });
  return settings;
};

export const deleteBannerImage = async (
  settingsId: number,
  bannerId: number
) => {
  const settings = await SiteSettings.findByPk(settingsId);
  if (!settings) throw new Error("Site settings not found");

  const currentBanners = settings.bannerImages || [];
  const filteredBanners = currentBanners.filter(b => b.id !== bannerId);

  if (filteredBanners.length === currentBanners.length) {
    throw new Error("Banner not found");
  }

  await settings.update({ bannerImages: filteredBanners });
  return settings;
};