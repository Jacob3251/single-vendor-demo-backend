import { Request, Response, NextFunction } from 'express';
export declare const NotificationControllers: {
    getUnread: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    markAsRead: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=notification.controller.d.ts.map