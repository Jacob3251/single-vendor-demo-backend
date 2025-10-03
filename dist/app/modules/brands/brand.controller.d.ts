import { Request, Response, NextFunction } from "express";
export declare const BrandControllers: {
    createBrand: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllBrands: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBrandById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    updateBrand: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteBrand: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=brand.controller.d.ts.map