"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationControllers = void 0;
const notification_service_1 = require("./notification.service");
const getUnread = async (req, res, next) => {
    try {
        const notifications = await notification_service_1.NotificationServices.getUnreadNotifications();
        res.status(200).json({ success: true, data: notifications });
    }
    catch (error) {
        next(error);
    }
};
const markAsRead = async (req, res, next) => {
    try {
        const { ids } = req.body;
        if (!Array.isArray(ids)) {
            return res.status(400).json({ success: false, error: { message: "Invalid payload: 'ids' must be an array." } });
        }
        await notification_service_1.NotificationServices.markNotificationsAsRead(ids);
        res.status(200).json({ success: true, message: "Notifications marked as read." });
    }
    catch (error) {
        next(error);
    }
};
exports.NotificationControllers = {
    getUnread,
    markAsRead,
};
//# sourceMappingURL=notification.controller.js.map