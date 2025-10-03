import express from 'express';
import { ProfileControllers } from './profile.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { adminMiddleware } from '../../middlewares/admin.middleware';

const router = express.Router();

// --- Authenticated User Routes (for managing their own profile) ---
router.get('/me', authMiddleware, ProfileControllers.getMyProfile);
router.put('/me', authMiddleware, ProfileControllers.updateMyProfile);

// --- Admin-Only Route (for updating any user's profile) ---
router.put(
  '/:userId',
  authMiddleware,
  ProfileControllers.updateUserProfile
);

export default router;

