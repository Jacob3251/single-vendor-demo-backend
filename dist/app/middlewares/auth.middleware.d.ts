import { Request, Response, NextFunction } from 'express';
import User from "../modules/user/user.model";
declare global {
    namespace Express {
        interface Request {
            firebaseUser?: {
                uid: string;
                email?: string | undefined;
            };
            user?: User | null;
        }
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=auth.middleware.d.ts.map