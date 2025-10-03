import Brand from "./brand.model";
export declare const BrandServices: {
    createBrandInDB: (brandData: Record<string, any>) => Promise<Brand>;
    getAllBrandsFromDB: () => Promise<Brand[]>;
    getBrandByIdFromDB: (id: string) => Promise<Brand>;
    updateBrandInDB: (id: string, payload: Record<string, any>) => Promise<Brand>;
    deleteBrandFromDB: (id: string) => Promise<Brand>;
};
//# sourceMappingURL=brand.service.d.ts.map