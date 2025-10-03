"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandServices = void 0;
const brand_model_1 = __importDefault(require("./brand.model"));
const createBrandInDB = async (brandData) => {
    const result = await brand_model_1.default.create(brandData);
    return result;
};
const getAllBrandsFromDB = async () => {
    const result = await brand_model_1.default.findAll({
        order: [["name", "ASC"]],
    });
    return result;
};
const getBrandByIdFromDB = async (id) => {
    const result = await brand_model_1.default.findByPk(id);
    if (!result) {
        throw new Error("Brand not found");
    }
    return result;
};
const updateBrandInDB = async (id, payload) => {
    const brand = await brand_model_1.default.findByPk(id);
    if (!brand) {
        throw new Error("Brand not found");
    }
    const result = await brand.update(payload);
    return result;
};
const deleteBrandFromDB = async (id) => {
    const brand = await brand_model_1.default.findByPk(id);
    if (!brand) {
        throw new Error("Brand not found");
    }
    await brand.destroy();
    return brand;
};
exports.BrandServices = {
    createBrandInDB,
    getAllBrandsFromDB,
    getBrandByIdFromDB,
    updateBrandInDB,
    deleteBrandFromDB,
};
//# sourceMappingURL=brand.service.js.map