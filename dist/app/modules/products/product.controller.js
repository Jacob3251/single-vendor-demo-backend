"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const product_service_1 = require("./product.service");
const products_validation_1 = require("./products.validation");
/**
 * Admin creates a product
 */
const createProduct = async (req, res, next) => {
    try {
        const validatedData = products_validation_1.ProductValidations.createProductValidationSchema.parse(req.body);
        const result = await product_service_1.ProductServices.createProductInDB(validatedData);
        res.status(201).json({
            success: true,
            message: "Product created successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Fetch all products with pagination & filtering
 */
const getAllProducts = async (req, res, next) => {
    try {
        const options = {
            searchTerm: req.query.search ? String(req.query.search) : undefined,
            status: req.query.status === "ACTIVE" || req.query.status === "DRAFT"
                ? req.query.status
                : undefined,
            page: req.query.page ? parseInt(String(req.query.page), 10) : 1,
            limit: req.query.limit ? parseInt(String(req.query.limit), 10) : 10,
        };
        console.log("options", options);
        const result = await product_service_1.ProductServices.getAllProductsFromDB(options);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Get product by ID
 */
const getProductById = async (req, res, next) => {
    try {
        const id = String(req.params.id); // ✅ ensure id is string
        const result = await product_service_1.ProductServices.getProductByIdFromDB(id);
        res.status(200).json({
            success: true,
            message: "Product fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Update product (full update)
 */
const updateProduct = async (req, res, next) => {
    try {
        const id = String(req.params.id); // ✅ ensure id is string
        const validatedData = products_validation_1.ProductValidations.updateProductValidationSchema.parse(req.body);
        const result = await product_service_1.ProductServices.updateProductInDB(id, validatedData);
        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Update SEO fields only
 */
const updateProductSeo = async (req, res, next) => {
    try {
        const id = String(req.params.id); // ✅ ensure id is string
        const validatedData = products_validation_1.ProductValidations.updateSeoValidationSchema.parse(req.body);
        const result = await product_service_1.ProductServices.updateSeoInDB(id, validatedData);
        res.status(200).json({
            success: true,
            message: "Product SEO updated successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Delete product by ID
 */
const deleteProduct = async (req, res, next) => {
    try {
        const id = String(req.params.id); // ✅ ensure id is string
        await product_service_1.ProductServices.deleteProductFromDB(id);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully!",
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Duplicate a product
 */
const duplicateProduct = async (req, res, next) => {
    try {
        const id = String(req.params.id); // ✅ ensure id is string
        const result = await product_service_1.ProductServices.duplicateProductInDB(id);
        res.status(201).json({
            success: true,
            message: "Product duplicated successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Delete multiple products
 */
const deleteMultipleProducts = async (req, res, next) => {
    try {
        const ids = req.body.ids;
        if (!ids || !Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: "Invalid input: 'ids' must be an array.",
            });
        }
        const result = await product_service_1.ProductServices.deleteMultipleProductsFromDB(ids);
        res.status(200).json({
            success: true,
            message: `${result} products deleted successfully!`,
            data: null,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Fetch products by type
 */
const getProductsByType = async (req, res, next) => {
    try {
        const type = req.query.type ? String(req.query.type) : undefined; // ✅ narrowed to string | undefined
        const result = await product_service_1.ProductServices.getProductsByTypeFromDB(type);
        res.status(200).json({
            success: true,
            message: type
                ? `Products of type '${type}' fetched successfully!`
                : "All products fetched successfully!",
            data: result,
        });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Get product by slug
 */
const getProductBySlug = async (req, res, next) => {
    try {
        const slug = String(req.params.slug); // ✅ ensure slug is string
        const result = await product_service_1.ProductServices.getProductBySlugFromDB(slug);
        if (!result) {
            return res.status(404).json({
                success: false,
                error: { message: "Product not found." },
            });
        }
        res.status(200).json({ success: true, data: result });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Fetch products by brand
 */
const getProductsByBrand = async (req, res, next) => {
    try {
        const brandId = Number(req.params.brandId); // ✅ ensure brandId is number
        const products = await product_service_1.ProductServices.getProductsByBrandIdFromDB(brandId);
        res.status(200).json({ success: true, data: products });
    }
    catch (error) {
        next(error);
    }
};
exports.ProductControllers = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    updateProductSeo,
    deleteProduct,
    duplicateProduct,
    deleteMultipleProducts,
    getProductsByType,
    getProductBySlug,
    getProductsByBrand,
};
//# sourceMappingURL=product.controller.js.map