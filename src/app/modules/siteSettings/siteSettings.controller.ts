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
