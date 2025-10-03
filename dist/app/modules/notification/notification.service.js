"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServices = void 0;
const notification_model_1 = __importDefault(require("./notification.model"));
const sequelize_1 = require("sequelize");
/**
 * Creates a new notification in the database.
 */
const createNotification = async (type, message, entityId) => {
    return notification_model_1.default.create({ type, message, entityId });
};
/**
 * Fetches all unread notifications.
 */
const getUnreadNotifications = async () => {
    return notification_model_1.default.findAll({
        where: { isRead: false },
        order: [['createdAt', 'DESC']],
        limit: 10, // Limit to the 10 most recent
    });
};
/**
 * Marks a list of notifications as read.
 */
const markNotificationsAsRead = async (notificationIds) => {
    return notification_model_1.default.update({ isRead: true }, { where: { id: { [sequelize_1.Op.in]: notificationIds } } });
};
exports.NotificationServices = {
    createNotification,
    getUnreadNotifications,
    markNotificationsAsRead,
};
//# sourceMappingURL=notification.service.js.map