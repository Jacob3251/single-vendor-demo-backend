import express from 'express';
import { StatsControllers } from './stats.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';

const router = express.Router();

// This route is protected and only accessible to administrators.
router.get('/dashboard', authMiddleware, adminMiddleware, StatsControllers.getDashboardStats);

export default router;
