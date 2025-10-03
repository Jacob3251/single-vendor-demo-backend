import SiteSettings from "./siteSettings.model";

export const getAllSettings = async () => {
  // Return all rows (if you want single row, change to findOne)
  return await SiteSettings.findAll({ order: [["id", "ASC"]] });
};

export const getCurrentSettings = async () => {
  // Useful if you want just the first/default settings record
  return await SiteSettings.findOne();
};

export const updateSettings = async (id: number, data: Partial<any>) => {
  const settings = await SiteSettings.findByPk(id);
  if (!settings) throw new Error("Site settings not found");
  await settings.update(data);
  return settings;
};

// Optionally create default row if none exists
export const createDefaultIfNone = async () => {
  const count = await SiteSettings.count();
  if (count === 0) {
    return await SiteSettings.create({});
  }
  return null;
};
