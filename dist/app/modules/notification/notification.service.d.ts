import Notification from './notification.model';
export declare const NotificationServices: {
    createNotification: (type: "NEW_ORDER" | "LOW_STOCK" | "NEW_USER", message: string, entityId?: number) => Promise<Notification>;
    getUnreadNotifications: () => Promise<Notification[]>;
    markNotificationsAsRead: (notificationIds: number[]) => Promise<[affectedCount: number]>;
};
//# sourceMappingURL=notification.service.d.ts.map