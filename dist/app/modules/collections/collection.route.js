"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collection_controller_1 = require("./collection.controller");
const router = express_1.default.Router();
router.post("/", collection_controller_1.CollectionControllers.createCollection);
router.get("/", collection_controller_1.CollectionControllers.getAllCollections);
router.get("/:id", collection_controller_1.CollectionControllers.getCollectionById);
router.put("/:id", collection_controller_1.CollectionControllers.updateCollection);
router.delete("/:id", collection_controller_1.CollectionControllers.deleteCollection);
router.get("/slug/:slug", collection_controller_1.CollectionControllers.getCollectionBySlug);
exports.default = router;
//# sourceMappingURL=collection.route.js.map