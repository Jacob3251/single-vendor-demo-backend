import { Request, Response } from "express";
import * as service from "./siteSettings.service";

export const getAll = async (req: Request, res: Response) => {
  try {
    const settings = await service.getAllSettings();
    return res.status(200).json({ success: true, data: settings });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: "Missing id param" });

    const updated = await service.updateSettings(id, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Add a new banner image
export const addBanner = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { imgLink, altText } = req.body;

    if (!id) return res.status(400).json({ success: false, message: "Missing id param" });
    if (!imgLink || !altText) {
      return res.status(400).json({ 
        success: false, 
        message: "imgLink and altText are required" 
      });
    }

    const updated = await service.addBannerImage(id, { imgLink, altText });
    return res.status(200).json({ success: true, data: updated });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update a specific banner image
export const updateBanner = async (req: Request, res: Response) => {
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
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a specific banner image
export const deleteBanner = async (req: Request, res: Response) => {
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
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};