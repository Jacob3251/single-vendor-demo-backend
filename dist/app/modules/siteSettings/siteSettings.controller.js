"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.addBanner = exports.update = exports.getAll = void 0;
const service = __importStar(require("./siteSettings.service"));
const getAll = async (req, res) => {
    try {
        const settings = await service.getAllSettings();
        return res.status(200).json({ success: true, data: settings });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.getAll = getAll;
const update = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id)
            return res.status(400).json({ success: false, message: "Missing id param" });
        const updated = await service.updateSettings(id, req.body);
        return res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.update = update;
// Add a new banner image
const addBanner = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { imgLink, altText } = req.body;
        if (!id)
            return res.status(400).json({ success: false, message: "Missing id param" });
        if (!imgLink || !altText) {
            return res.status(400).json({
                success: false,
                message: "imgLink and altText are required"
            });
        }
        const updated = await service.addBannerImage(id, { imgLink, altText });
        return res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.addBanner = addBanner;
// Update a specific banner image
const updateBanner = async (req, res) => {
    try {
        const settingsId = Number(req.params.id);
        const bannerId = Number(req.params.bannerId);
        if (!settingsId || !bannerId) {
            return res.status(400).json({
                success: false,
                message: "Missing id or bannerId param"
            });
        }
        const updated = await service.updateBannerImage(settingsId, bannerId, req.body);
        return res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.updateBanner = updateBanner;
// Delete a specific banner image
const deleteBanner = async (req, res) => {
    try {
        const settingsId = Number(req.params.id);
        const bannerId = Number(req.params.bannerId);
        if (!settingsId || !bannerId) {
            return res.status(400).json({
                success: false,
                message: "Missing id or bannerId param"
            });
        }
        const updated = await service.deleteBannerImage(settingsId, bannerId);
        return res.status(200).json({ success: true, data: updated });
    }
    catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=siteSettings.controller.js.map