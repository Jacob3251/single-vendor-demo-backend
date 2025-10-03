"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_controller_1 = require("./brand.controller");
const router = express_1.default.Router();
router.post("/", brand_controller_1.BrandControllers.createBrand);
router.get("/", brand_controller_1.BrandControllers.getAllBrands);
router.get("/:id", brand_controller_1.BrandControllers.getBrandById);
router.put("/:id", brand_controller_1.BrandControllers.updateBrand);
router.delete("/:id", brand_controller_1.BrandControllers.deleteBrand);
exports.default = router;
//# sourceMappingURL=brand.route.js.map