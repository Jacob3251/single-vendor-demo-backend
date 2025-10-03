import express from "express";
import { UserControllers } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = express.Router();

// --- GENERAL AUTHENTICATED ROUTES ---

// Route for the currently logged-in user to get their own profile and data.
router.get("/me", authMiddleware, UserControllers.getMe);

// Route for a user to sync their Firebase account with the local DB after signup or login.
router.post("/sync", authMiddleware, UserControllers.sync);


// --- ADMIN-ONLY ROUTES ---
// These routes are protected by an additional adminMiddleware check.

// Route for an ADMIN to get a paginated and searchable list of all users.
router.get("/", authMiddleware, adminMiddleware, UserControllers.getAll);

// Route for an ADMIN to get a specific user's details by their ID.
router.get(
  "/:userId",
  authMiddleware,
  UserControllers.getUserById
);

// Route for an ADMIN to update another user's role.
router.put(
  "/:userId/role",
  authMiddleware,
  adminMiddleware,
  UserControllers.updateUserRole
);

// Route for an ADMIN to permanently delete a user from Firebase and the local database.
router.delete(
  "/:userId",
  authMiddleware,
  adminMiddleware,
  UserControllers.deleteUser
);

export default router;

