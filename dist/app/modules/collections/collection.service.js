"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionServices = void 0;
const database_1 = __importDefault(require("../../database"));
const collection_model_1 = __importDefault(require("./collection.model"));
const product_model_1 = __importDefault(require("../products/product.model"));
const collection_product_model_1 = __importDefault(require("./collection_product.model"));
const brand_model_1 = __importDefault(require("../brands/brand.model"));
// Helper function to generate a URL-friendly slug from a name
const generateSlug = (name) => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-"); // Remove consecutive hyphens
};
/**
 * Creates a new collection in the database.
 */
const createCollectionInDB = async (payload) => {
    const { productIds, ...collectionData } = payload;
    // Auto-generate a slug from the name if one isn't provided
    if (!collectionData.slug && collectionData.name) {
        collectionData.slug = generateSlug(collectionData.name);
    }
    return await database_1.default.transaction(async (t) => {
        const collection = await collection_model_1.default.create(collectionData, { transaction: t });
        if (productIds?.length) {
            const associations = productIds.map(productId => ({
                collectionId: collection.id, // Fix: Type assertion for id access
                productId: productId,
            }));
            await collection_product_model_1.default.bulkCreate(associations, { transaction: t });
        }
        // Return the new collection with its products for confirmation
        return collection_model_1.default.findByPk(collection.id, {
            include: [{ model: product_model_1.default, as: "products", attributes: ["id", "name"], through: { attributes: [] } }],
            transaction: t,
        });
    });
};
/**
 * Updates an existing collection.
 */
const updateCollectionInDB = async (id, payload) => {
    const { productIds, ...collectionData } = payload;
    const collection = await collection_model_1.default.findByPk(id);
    if (!collection) {
        throw new Error("Collection not found");
    }
    // Auto-generate a slug if the name is being updated and a slug isn't provided
    if (collectionData.name && !collectionData.slug) {
        collectionData.slug = generateSlug(collectionData.name);
    }
    await collection.update(collectionData);
    // `setProducts` is an efficient way to sync the associated products on an update
    if (productIds !== undefined) {
        await collection.setProducts(productIds);
    }
    return getCollectionByIdFromDB(id);
};
// --- Other service functions ---
const getCollectionByIdFromDB = async (id) => {
    const collection = await collection_model_1.default.findByPk(id, {
        include: [{ model: product_model_1.default, as: "products", through: { attributes: [] } }],
    });
    if (!collection)
        throw new Error("Collection not found");
    return collection;
};
/**
 * Retrieves a single collection by its unique slug.
 */
const getCollectionBySlugFromDB = async (slug) => {
    const collection = await collection_model_1.default.findOne({
        where: { slug, status: 'ACTIVE' },
        include: [{
                model: product_model_1.default,
                as: 'products',
                where: { status: 'ACTIVE' },
                required: false,
                include: [{
                        model: brand_model_1.default,
                        as: 'brand',
                        attributes: ['id', 'name'],
                    }]
            }]
    });
    if (!collection) {
        throw new Error("Collection not found");
    }
    return collection;
};
const getAllCollectionsFromDB = async () => {
    return collection_model_1.default.findAll({
        include: [{ model: product_model_1.default, as: "products", through: { attributes: [] } }],
        order: [["order", "ASC"], ["createdAt", "DESC"]],
    });
};
const deleteCollectionFromDB = async (id) => {
    const collection = await collection_model_1.default.findByPk(id);
    if (!collection)
        throw new Error("Collection not found");
    await collection.destroy();
    return { id };
};
exports.CollectionServices = {
    createCollectionInDB,
    getCollectionByIdFromDB,
    updateCollectionInDB,
    getAllCollectionsFromDB,
    deleteCollectionFromDB,
    getCollectionBySlugFromDB,
};
//# sourceMappingURL=collection.service.js.map