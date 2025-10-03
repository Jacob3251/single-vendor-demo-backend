import { Request, Response, NextFunction } from "express";
import { CollectionServices } from "./collection.service";
import { CollectionValidations } from "./collection.validation";

const createCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = CollectionValidations.createCollectionValidationSchema.parse(req.body);
    const result = await CollectionServices.createCollectionInDB(validatedData);
    res.status(201).json({
      success: true,
      message: "Collection created successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCollectionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Fix: Check if id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }
    
    const result = await CollectionServices.getCollectionByIdFromDB(id);
    res.status(200).json({
      success: true,
      message: "Collection fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Fix: Check if id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }
    
    const validatedData = CollectionValidations.updateCollectionValidationSchema.parse(req.body);
    const result = await CollectionServices.updateCollectionInDB(id, validatedData);
    res.status(200).json({
      success: true,
      message: "Collection updated successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllCollections = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await CollectionServices.getAllCollectionsFromDB();
    res.status(200).json({
      success: true,
      message: "Collections fetched successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCollection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Fix: Check if id exists
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Collection ID is required",
      });
    }
    
    const result = await CollectionServices.deleteCollectionFromDB(id);
    res.status(200).json({
      success: true,
      message: "Collection deleted successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getCollectionBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    
    // Fix: Check if slug exists
    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Collection slug is required",
      });
    }
    
    const result = await CollectionServices.getCollectionBySlugFromDB(slug);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    // Correctly send a 404 if the service throws a "not found" error
    if ((error as Error).message === "Collection not found") {
      return res.status(404).json({ success: false, error: { message: "Collection not found." } });
    }
    next(error);
  }
};

export const CollectionControllers = {
  createCollection,
  getCollectionById,
  updateCollection,
  getAllCollections,
  deleteCollection,
  getCollectionBySlug
};