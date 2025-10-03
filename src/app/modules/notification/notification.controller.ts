import { Request, Response, NextFunction } from 'express';
import { NotificationServices } from './notification.service';

const getUnread = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notifications = await NotificationServices.getUnreadNotifications();
    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    next(error);
  }
};

const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, error: { message: "Invalid payload: 'ids' must be an array." } });
    }
    await NotificationServices.markNotificationsAsRead(ids);
    res.status(200).json({ success: true, message: "Notifications marked as read." });
  } catch (error) {
    next(error);
  }
};

export const NotificationControllers = {
  getUnread,
  markAsRead,
};
