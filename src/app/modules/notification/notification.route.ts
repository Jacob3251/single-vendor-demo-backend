import express from 'express';
import { NotificationControllers } from './notification.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';

const router = express.Router();

// These routes are for admins to manage notifications
router.get('/', authMiddleware, adminMiddleware, NotificationControllers.getUnread);
router.put('/mark-read', authMiddleware, adminMiddleware, NotificationControllers.markAsRead);

export default router;
