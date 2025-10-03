"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const sequelize_1 = require("sequelize");
const product_model_1 = __importDefault(require("./product.model"));
const brand_model_1 = __importDefault(require("../brands/brand.model"));
/**
 * Utility to generate a slug from a name.
 */
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
};
const createProductInDB = async (productData) => {
    if (!productData.slug && productData.name) {
        productData.slug = generateSlug(productData.name);
    }
    else if (productData.slug) {
        productData.slug = generateSlug(productData.slug);
    }
    return await product_model_1.default.create(productData);
};
const updateProductInDB = async (id, payload) => {
    const product = await product_model_1.default.findByPk(id);
    if (!product)
        throw new Error("Product not found");
    if (payload.name && !payload.slug) {
        payload.slug = generateSlug(payload.name);
    }
    else if (payload.slug) {
        payload.slug = generateSlug(payload.slug);
    }
    return await product.update(payload);
};
const updateSeoInDB = async (id, payload) => {
    const product = await product_model_1.default.findByPk(id);
    if (!product)
        throw new Error("Product not found");
    if (payload.slug) {
        payload.slug = generateSlug(payload.slug);
    }
    return await product.update(payload);
};
/**
 * Fetch all products with pagination and filtering.
 * ✅ FIXED: Proper PostgreSQL syntax with Op.iLike
 */
const getAllProductsFromDB = async (options) => {
    const { searchTerm, status, page = 1, limit = 4 } = options;
    const whereClause = {};
    const includeOptions = [
        { model: brand_model_1.default, as: "brand", attributes: ["id", "name"] },
    ];
    if (status) {
        whereClause.status = status;
    }
    // ✅ FIXED: Use proper object syntax for Op.or
    if (searchTerm) {
        whereClause[sequelize_1.Op.or] = [
            { name: { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
            { "$brand.name$": { [sequelize_1.Op.iLike]: `%${searchTerm}%` } },
        ];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await product_model_1.default.findAndCountAll({
        where: whereClause,
        include: includeOptions,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
        subQuery: false,
    });
    return {
        products: rows,
        meta: {
            total: count,
            page,
            limit,
            totalPages: Math.ceil(count / limit),
        },
    };
};
const getProductByIdFromDB = async (id) => {
    const result = await product_model_1.default.findByPk(id, {
        include: [{ model: brand_model_1.default, as: "brand", attributes: ["id", "name"] }],
    });
    if (!result)
        throw new Error("Product not found");
    return result;
};
const deleteProductFromDB = async (id) => {
    const product = await product_model_1.default.findByPk(id);
    if (!product)
        throw new Error("Product not found");
    await product.destroy();
};
const duplicateProductInDB = async (id) => {
    const product = await product_model_1.default.findByPk(id);
    if (!product)
        throw new Error("Product not found");
    const duplicationData = { ...product.get() };
    duplicationData.name = `${duplicationData.name} - Duplicate`;
    duplicationData.status = "DRAFT";
    duplicationData.slug = `${duplicationData.slug}-copy-${Date.now()}`;
    delete duplicationData.id;
    delete duplicationData.createdAt;
    delete duplicationData.updatedAt;
    return await product_model_1.default.create(duplicationData);
};
const deleteMultipleProductsFromDB = async (ids) => {
    return await product_model_1.default.destroy({
        where: { id: { [sequelize_1.Op.in]: ids } },
    });
};
const getProductsByTypeFromDB = async (type) => {
    const queryOptions = {
        include: [{ model: brand_model_1.default, as: "brand", attributes: ["id", "name"] }],
        order: [["createdAt", "DESC"]],
    };
    if (type && type.toUpperCase() !== "ALL") {
        queryOptions.where = { type: type.toUpperCase() };
    }
    return await product_model_1.default.findAll(queryOptions);
};
const getProductBySlugFromDB = async (slug) => {
    return await product_model_1.default.findOne({
        where: { slug },
        include: [{ model: brand_model_1.default, as: "brand", attributes: ["id", "name"] }],
    });
};
const getProductsByBrandIdFromDB = async (brandId) => {
    return await product_model_1.default.findAll({
        where: { brandId, status: "ACTIVE" },
        include: [{ model: brand_model_1.default, as: "brand" }],
        order: [["createdAt", "DESC"]],
    });
};
exports.ProductServices = {
    createProductInDB,
    updateProductInDB,
    updateSeoInDB,
    getAllProductsFromDB,
    getProductByIdFromDB,
    deleteProductFromDB,
    duplicateProductInDB,
    deleteMultipleProductsFromDB,
    getProductsByTypeFromDB,
    getProductBySlugFromDB,
    getProductsByBrandIdFromDB,
};
//# sourceMappingURL=product.service.js.map