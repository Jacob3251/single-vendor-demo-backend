import Brand from "./brand.model";

const createBrandInDB = async (brandData: Record<string, any>) => {
  const result = await Brand.create(brandData);
  return result;
};

const getAllBrandsFromDB = async () => {
  const result = await Brand.findAll({
    order: [["name", "ASC"]],
  });
  return result;
};

const getBrandByIdFromDB = async (id: string) => {
  const result = await Brand.findByPk(id);
  if (!result) {
    throw new Error("Brand not found");
  }
  return result;
};

const updateBrandInDB = async (id: string, payload: Record<string, any>) => {
  const brand = await Brand.findByPk(id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  const result = await brand.update(payload);
  return result;
};

const deleteBrandFromDB = async (id: string) => {
  const brand = await Brand.findByPk(id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  await brand.destroy();
  return brand;
};

export const BrandServices = {
  createBrandInDB,
  getAllBrandsFromDB,
  getBrandByIdFromDB,
  updateBrandInDB,
  deleteBrandFromDB,
};