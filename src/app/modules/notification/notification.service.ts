import Notification from './notification.model';
import { Op } from 'sequelize';

/**
 * Creates a new notification in the database.
 */
const createNotification = async (
  type: 'NEW_ORDER' | 'LOW_STOCK' | 'NEW_USER',
  message: string,
  entityId?: number
) => {
  return Notification.create({ type, message, entityId });
};

/**
 * Fetches all unread notifications.
 */
const getUnreadNotifications = async () => {
  return Notification.findAll({
    where: { isRead: false },
    order: [['createdAt', 'DESC']],
    limit: 10, // Limit to the 10 most recent
  });
};

/**
 * Marks a list of notifications as read.
 */
const markNotificationsAsRead = async (notificationIds: number[]) => {
  return Notification.update(
    { isRead: true },
    { where: { id: { [Op.in]: notificationIds } } }
  );
};

export const NotificationServices = {
  createNotification,
  getUnreadNotifications,
  markNotificationsAsRead,
};