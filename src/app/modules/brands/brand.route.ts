import express from "express";
import { BrandControllers } from "./brand.controller";

const router = express.Router();

router.post("/", BrandControllers.createBrand);
router.get("/", BrandControllers.getAllBrands);
router.get("/:id", BrandControllers.getBrandById);
router.put("/:id", BrandControllers.updateBrand);
router.delete("/:id", BrandControllers.deleteBrand);

export default router;