"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandControllers = void 0;
const brand_service_1 = require("./brand.service");
const brand_validation_1 = require("./brand.validation");
const createBrand = async (req, res, next) => {
    try {
        const validatedData = brand_validation_1.BrandValidations.createBrandValidationSchema.parse(req.body);
        const result = await brand_service_1.BrandServices.createBrandInDB(validatedData);
        res.status(201).json({
            success: true,
            message: "Brand created successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getAllBrands = async (req, res, next) => {
    try {
        const result = await brand_service_1.BrandServices.getAllBrandsFromDB();
        res.status(200).json({
            success: true,
            message: "Brands fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const getBrandById = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Fix: Check if id exists
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Brand ID is required",
            });
        }
        const result = await brand_service_1.BrandServices.getBrandByIdFromDB(id);
        res.status(200).json({
            success: true,
            message: "Brand fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const updateBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Fix: Check if id exists
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Brand ID is required",
            });
        }
        const validatedData = brand_validation_1.BrandValidations.updateBrandValidationSchema.parse(req.body);
        const result = await brand_service_1.BrandServices.updateBrandInDB(id, validatedData);
        res.status(200).json({
            success: true,
            message: "Brand updated successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
const deleteBrand = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Fix: Check if id exists
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Brand ID is required",
            });
        }
        await brand_service_1.BrandServices.deleteBrandFromDB(id);
        res.status(200).json({
            success: true,
            message: "Brand deleted successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.BrandControllers = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};
//# sourceMappingURL=brand.controller.js.map