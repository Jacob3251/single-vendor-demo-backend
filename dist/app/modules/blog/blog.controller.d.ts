import { Request, Response, NextFunction } from "express";
export declare const BlogControllers: {
    createBlogPost: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getAllBlogPosts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    getBlogPostBySlug: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getBlogPostById: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    updateBlogPost: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteBlogPost: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    deleteMultipleBlogPosts: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=blog.controller.d.ts.map