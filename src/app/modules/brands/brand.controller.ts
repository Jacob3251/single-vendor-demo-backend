import { Request, Response, NextFunction } from "express";
import { BrandServices } from "./brand.service";
import { BrandValidations } from "./brand.validation";

const createBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = BrandValidations.createBrandValidationSchema.parse(
      req.body
    );
    const result = await BrandServices.createBrandInDB(validatedData);
    res.status(201).json({
      success: true,
      message: "Brand created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllBrands = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await BrandServices.getAllBrandsFromDB();
    res.status(200).json({
      success: true,
      message: "Brands fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getBrandById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Fix: Check if id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brand ID is required",
      });
    }
    
    const result = await BrandServices.getBrandByIdFromDB(id);
    res.status(200).json({
      success: true,
      message: "Brand fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Fix: Check if id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brand ID is required",
      });
    }
    
    const validatedData = BrandValidations.updateBrandValidationSchema.parse(
      req.body
    );
    const result = await BrandServices.updateBrandInDB(id, validatedData);
    res.status(200).json({
      success: true,
      message: "Brand updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteBrand = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Fix: Check if id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Brand ID is required",
      });
    }
    
    await BrandServices.deleteBrandFromDB(id);
    res.status(200).json({
      success: true,
      message: "Brand deleted successfully!",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const BrandControllers = {
  createBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
  deleteBrand,
};