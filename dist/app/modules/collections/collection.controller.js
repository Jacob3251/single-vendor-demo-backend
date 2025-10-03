"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionControllers = void 0;
const collection_service_1 = require("./collection.service");
const collection_validation_1 = require("./collection.validation");
const createCollection = async (req, res, next) => {
    try {
        const validatedData = collection_validation_1.CollectionValidations.createCollectionValidationSchema.parse(req.body);
        const result = await collection_service_1.CollectionServices.createCollectionInDB(validatedData);
        res.status(201).json({
            success: true,
            message: "Collection created successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getCollectionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Fix: Check if id exists
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Collection ID is required",
            });
        }
        const result = await collection_service_1.CollectionServices.getCollectionByIdFromDB(id);
        res.status(200).json({
            success: true,
            message: "Collection fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Fix: Check if id exists
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Collection ID is required",
            });
        }
        const validatedData = collection_validation_1.CollectionValidations.updateCollectionValidationSchema.parse(req.body);
        const result = await collection_service_1.CollectionServices.updateCollectionInDB(id, validatedData);
        res.status(200).json({
            success: true,
            message: "Collection updated successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllCollections = async (req, res, next) => {
    try {
        const result = await collection_service_1.CollectionServices.getAllCollectionsFromDB();
        res.status(200).json({
            success: true,
            message: "Collections fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteCollection = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Fix: Check if id exists
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Collection ID is required",
            });
        }
        const result = await collection_service_1.CollectionServices.deleteCollectionFromDB(id);
        res.status(200).json({
            success: true,
            message: "Collection deleted successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getCollectionBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        // Fix: Check if slug exists
        if (!slug) {
            return res.status(400).json({
                success: false,
                message: "Collection slug is required",
            });
        }
        const result = await collection_service_1.CollectionServices.getCollectionBySlugFromDB(slug);
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        // Correctly send a 404 if the service throws a "not found" error
        if (error.message === "Collection not found") {
            return res.status(404).json({ success: false, error: { message: "Collection not found." } });
        }
        next(error);
    }
};
exports.CollectionControllers = {
    createCollection,
    getCollectionById,
    updateCollection,
    getAllCollections,
    deleteCollection,
    getCollectionBySlug
};
//# sourceMappingURL=collection.controller.js.map