import { Request, Response, NextFunction } from 'express';
export declare const ProfileControllers: {
    getMyProfile: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    updateMyProfile: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    updateUserProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
//# sourceMappingURL=profile.controller.d.ts.map