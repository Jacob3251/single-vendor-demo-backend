import { Request, Response, NextFunction } from "express";
export declare const CollectionControllers: {
    createCollection: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getCollectionById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    updateCollection: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getAllCollections: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    deleteCollection: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getCollectionBySlug: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=collection.controller.d.ts.map