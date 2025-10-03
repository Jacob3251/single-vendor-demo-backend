import { Request, Response, NextFunction } from "express";
export declare const ProductControllers: {
    createProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllProducts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    updateProductSeo: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    duplicateProduct: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteMultipleProducts: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getProductsByType: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getProductBySlug: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getProductsByBrand: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=product.controller.d.ts.map