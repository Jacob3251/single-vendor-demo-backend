import sequelize from "../../database";
import Collection from "./collection.model";
import Product from "../products/product.model";
import CollectionProduct from "./collection_product.model";
import { Op } from "sequelize";
import Brand from "../brands/brand.model";

// Helper function to generate a URL-friendly slug from a name
const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-")        // Replace spaces with hyphens
    .replace(/-+/g, "-");        // Remove consecutive hyphens
};

/**
 * Creates a new collection in the database.
 */
const createCollectionInDB = async (payload: {
  name: string;
  slug?: string | null;
  description?: string | null;
  status?: "ACTIVE" | "INACTIVE";
  order?: number;
  image?: string | null;
  productIds?: number[];
}) => {
  const { productIds, ...collectionData } = payload;

  // Auto-generate a slug from the name if one isn't provided
  if (!collectionData.slug && collectionData.name) {
      collectionData.slug = generateSlug(collectionData.name);
  }

  return await sequelize.transaction(async (t) => {
    const collection = await Collection.create(collectionData, { transaction: t });

    if (productIds?.length) {
      const associations = productIds.map(productId => ({
        collectionId: (collection as any).id, // Fix: Type assertion for id access
        productId: productId,
      }));
      await CollectionProduct.bulkCreate(associations, { transaction: t });
    }

    // Return the new collection with its products for confirmation
    return Collection.findByPk((collection as any).id, { // Fix: Type assertion for id access
      include: [{ model: Product, as: "products", attributes: ["id", "name"], through: { attributes: [] } }],
      transaction: t,
    });
  });
};

/**
 * Updates an existing collection.
 */
const updateCollectionInDB = async (id: string, payload: {
  name?: string;
  slug?: string | null;
  description?: string | null;
  status?: "ACTIVE" | "INACTIVE";
  order?: number;
  image?: string | null;
  productIds?: number[];
}) => {
  const { productIds, ...collectionData } = payload;
  const collection = await Collection.findByPk(id);

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
    await (collection as any).setProducts(productIds);
  }

  return getCollectionByIdFromDB(id);
};

// --- Other service functions ---

const getCollectionByIdFromDB = async (id: string) => {
  const collection = await Collection.findByPk(id, {
    include: [{ model: Product, as: "products", through: { attributes: [] } }],
  });
  if (!collection) throw new Error("Collection not found");
  return collection;
};

/**
 * Retrieves a single collection by its unique slug.
 */
const getCollectionBySlugFromDB = async (slug: string) => {
  const collection = await Collection.findOne({
    where: { slug, status: 'ACTIVE' },
    include: [{
        model: Product,
        as: 'products',
        where: { status: 'ACTIVE' },
        required: false,
        include: [{
            model: Brand,
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
  return Collection.findAll({
    include: [{ model: Product, as: "products", through: { attributes: [] } }],
    order: [["order", "ASC"], ["createdAt", "DESC"]],
  });
};

const deleteCollectionFromDB = async (id: string) => {
  const collection = await Collection.findByPk(id);
  if (!collection) throw new Error("Collection not found");
  await collection.destroy();
  return { id };
};

export const CollectionServices = {
  createCollectionInDB,
  getCollectionByIdFromDB,
  updateCollectionInDB,
  getAllCollectionsFromDB,
  deleteCollectionFromDB,
  getCollectionBySlugFromDB,
};