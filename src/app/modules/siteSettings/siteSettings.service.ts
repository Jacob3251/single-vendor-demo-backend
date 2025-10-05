import SiteSettings from "./siteSettings.model";
import type { BannerImage } from "./siteSettings.model";

export const getAllSettings = async () => {
  return await SiteSettings.findAll({ order: [["id", "ASC"]] });
};

export const getCurrentSettings = async () => {
  return await SiteSettings.findOne();
};

export const updateSettings = async (id: number, data: Partial<any>) => {
  let settings = await SiteSettings.findByPk(id);
  
  if (!settings) {
    const { bannerImages, ...settingsData } = data;
    settings = await SiteSettings.create({
      id: id,
      ...settingsData,
      bannerImages: null
    });
    return settings;
  }
  
  if (data.bannerImages !== undefined) {
    if (data.bannerImages !== null && !Array.isArray(data.bannerImages)) {
      throw new Error("bannerImages must be an array or null");
    }
    
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

export const createDefaultIfNone = async () => {
  const count = await SiteSettings.count();
  if (count === 0) {
    return await SiteSettings.create({});
  }
  return null;
};

export const addBannerImage = async (
  settingsId: number,
  bannerData: Omit<BannerImage, "id">
) => {
  const settings = await SiteSettings.findByPk(settingsId);
  if (!settings) throw new Error("Site settings not found");

  const currentBanners: BannerImage[] = Array.isArray(settings.bannerImages) 
    ? settings.bannerImages 
    : [];
    
  const newId = currentBanners.length > 0 
    ? Math.max(...currentBanners.map(b => b.id)) + 1 
    : 1;

  const newBanner: BannerImage = {
    id: newId,
    imgLink: bannerData.imgLink,
    altText: bannerData.altText,
  };

  const updatedBanners = [...currentBanners, newBanner];

  // CRITICAL: Mark the field as changed for JSONB
  settings.set('bannerImages', updatedBanners);
  settings.changed('bannerImages', true);
  
  await settings.save();
  await settings.reload();
  
  return settings;
};

export const updateBannerImage = async (
  settingsId: number,
  bannerId: number,
  bannerData: Partial<Omit<BannerImage, "id">>
) => {
  const settings = await SiteSettings.findByPk(settingsId);
  if (!settings) throw new Error("Site settings not found");

  const currentBanners: BannerImage[] = Array.isArray(settings.bannerImages)
    ? settings.bannerImages
    : [];
    
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

  const updatedBanners = [...currentBanners];
  updatedBanners[bannerIndex] = updatedBanner;

  // CRITICAL: Mark the field as changed for JSONB
  settings.set('bannerImages', updatedBanners);
  settings.changed('bannerImages', true);
  
  await settings.save();
  await settings.reload();
  
  return settings;
};

export const deleteBannerImage = async (
  settingsId: number,
  bannerId: number
) => {
  const settings = await SiteSettings.findByPk(settingsId);
  if (!settings) throw new Error("Site settings not found");

  const currentBanners: BannerImage[] = Array.isArray(settings.bannerImages)
    ? settings.bannerImages
    : [];
    
  const filteredBanners = currentBanners.filter(b => b.id !== bannerId);

  if (filteredBanners.length === currentBanners.length) {
    throw new Error("Banner not found");
  }

  // CRITICAL: Mark the field as changed for JSONB
  settings.set('bannerImages', filteredBanners);
  settings.changed('bannerImages', true);
  
  await settings.save();
  await settings.reload();
  
  return settings;
};