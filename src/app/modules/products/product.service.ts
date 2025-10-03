import { Op, WhereOptions, FindOptions } from "sequelize";
import Product from "./product.model";
import Brand from "../brands/brand.model";
import {
  CreateProductInput,
  UpdateProductInput,
  UpdateSeoInput,
} from "./products.validation";

/**
 * Utility to generate a slug from a name.
 */
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const createProductInDB = async (productData: CreateProductInput): Promise<Product> => {
  if (!productData.slug && productData.name) {
    productData.slug = generateSlug(productData.name);
  } else if (productData.slug) {
    productData.slug = generateSlug(productData.slug);
  }
  return await Product.create(productData);
};

const updateProductInDB = async (
  id: string,
  payload: UpdateProductInput
): Promise<Product> => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  if (payload.name && !payload.slug) {
    payload.slug = generateSlug(payload.name);
  } else if (payload.slug) {
    payload.slug = generateSlug(payload.slug);
  }

  return await product.update(payload);
};

const updateSeoInDB = async (id: string, payload: UpdateSeoInput): Promise<Product> => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");

  if (payload.slug) {
    payload.slug = generateSlug(payload.slug);
  }

  return await product.update(payload);
};

/**
 * Fetch all products with pagination and filtering.
 * ✅ FIXED: Proper PostgreSQL syntax with Op.iLike
 */
const getAllProductsFromDB = async (options: {
  searchTerm?: string;
  status?: "ACTIVE" | "DRAFT";
  page?: number;
  limit?: number;
}) => {
  const { searchTerm, status, page = 1, limit = 4 } = options;

  const whereClause: WhereOptions<any> = {};
  const includeOptions: FindOptions["include"] = [
    { model: Brand, as: "brand", attributes: ["id", "name"] },
  ];

  if (status) {
    whereClause.status = status;
  }

  // ✅ FIXED: Use proper object syntax for Op.or
  if (searchTerm) {
    whereClause[Op.or as any] = [
      { name: { [Op.iLike]: `%${searchTerm}%` } },
      { "$brand.name$": { [Op.iLike]: `%${searchTerm}%` } },
    ];
  }

  const offset = (page - 1) * limit;
  const { count, rows } = await Product.findAndCountAll({
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

const getProductByIdFromDB = async (id: string): Promise<Product> => {
  const result = await Product.findByPk(id, {
    include: [{ model: Brand, as: "brand", attributes: ["id", "name"] }],
  });
  if (!result) throw new Error("Product not found");
  return result;
};

const deleteProductFromDB = async (id: string): Promise<void> => {
  const product = await Product.findByPk(id);
  if (!product) throw new Error("Product not found");
  await product.destroy();
};

const duplicateProductInDB = async (id: string): Promise<Product> => {
  const product = await Product.findByPk(id);

  if (!product) throw new Error("Product not found");

  const duplicationData: any = { ...product.get() };

  duplicationData.name = `${duplicationData.name} - Duplicate`;
  duplicationData.status = "DRAFT";
  duplicationData.slug = `${duplicationData.slug}-copy-${Date.now()}`;
  delete duplicationData.id;
  delete duplicationData.createdAt;
  delete duplicationData.updatedAt;

  return await Product.create(duplicationData);
};

const deleteMultipleProductsFromDB = async (ids: string[]): Promise<number> => {
  return await Product.destroy({
    where: { id: { [Op.in]: ids } },
  });
};

const getProductsByTypeFromDB = async (type?: string): Promise<Product[]> => {
  const queryOptions: FindOptions = {
    include: [{ model: Brand, as: "brand", attributes: ["id", "name"] }],
    order: [["createdAt", "DESC"]],
  };

  if (type && type.toUpperCase() !== "ALL") {
    queryOptions.where = { type: type.toUpperCase() };
  }

  return await Product.findAll(queryOptions);
};

const getProductBySlugFromDB = async (slug: string): Promise<Product | null> => {
  return await Product.findOne({
    where: { slug },
    include: [{ model: Brand, as: "brand", attributes: ["id", "name"] }],
  });
};

const getProductsByBrandIdFromDB = async (brandId: number): Promise<Product[]> => {
  return await Product.findAll({
    where: { brandId, status: "ACTIVE" },
    include: [{ model: Brand, as: "brand" }],
    order: [["createdAt", "DESC"]],
  });
};

export const ProductServices = {
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