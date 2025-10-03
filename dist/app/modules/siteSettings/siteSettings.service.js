"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultIfNone = exports.updateSettings = exports.getCurrentSettings = exports.getAllSettings = void 0;
const siteSettings_model_1 = __importDefault(require("./siteSettings.model"));
const getAllSettings = async () => {
    // Return all rows (if you want single row, change to findOne)
    return await siteSettings_model_1.default.findAll({ order: [["id", "ASC"]] });
};
exports.getAllSettings = getAllSettings;
const getCurrentSettings = async () => {
    // Useful if you want just the first/default settings record
    return await siteSettings_model_1.default.findOne();
};
exports.getCurrentSettings = getCurrentSettings;
const updateSettings = async (id, data) => {
    const settings = await siteSettings_model_1.default.findByPk(id);
    if (!settings)
        throw new Error("Site settings not found");
    await settings.update(data);
    return settings;
};
exports.updateSettings = updateSettings;
// Optionally create default row if none exists
const createDefaultIfNone = async () => {
    const count = await siteSettings_model_1.default.count();
    if (count === 0) {
        return await siteSettings_model_1.default.create({});
    }
    return null;
};
exports.createDefaultIfNone = createDefaultIfNone;
//# sourceMappingURL=siteSettings.service.js.map