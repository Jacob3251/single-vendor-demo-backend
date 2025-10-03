import express from "express";
import { CollectionControllers } from "./collection.controller";

const router = express.Router();
router.post("/", CollectionControllers.createCollection);
router.get("/", CollectionControllers.getAllCollections);
router.get("/:id", CollectionControllers.getCollectionById);
router.put("/:id", CollectionControllers.updateCollection);
router.delete("/:id", CollectionControllers.deleteCollection);
router.get("/slug/:slug", CollectionControllers.getCollectionBySlug);
export default router;
