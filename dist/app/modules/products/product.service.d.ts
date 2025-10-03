import Product from "./product.model";
import { CreateProductInput, UpdateProductInput, UpdateSeoInput } from "./products.validation";
export declare const ProductServices: {
    createProductInDB: (productData: CreateProductInput) => Promise<Product>;
    updateProductInDB: (id: string, payload: UpdateProductInput) => Promise<Product>;
    updateSeoInDB: (id: string, payload: UpdateSeoInput) => Promise<Product>;
    getAllProductsFromDB: (options: {
        searchTerm?: string;
        status?: "ACTIVE" | "DRAFT";
        page?: number;
        limit?: number;
    }) => Promise<{
        products: Product[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getProductByIdFromDB: (id: string) => Promise<Product>;
    deleteProductFromDB: (id: string) => Promise<void>;
    duplicateProductInDB: (id: string) => Promise<Product>;
    deleteMultipleProductsFromDB: (ids: string[]) => Promise<number>;
    getProductsByTypeFromDB: (type?: string) => Promise<Product[]>;
    getProductBySlugFromDB: (slug: string) => Promise<Product | null>;
    getProductsByBrandIdFromDB: (brandId: number) => Promise<Product[]>;
};
//# sourceMappingURL=product.service.d.ts.map