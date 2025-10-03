"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
// --- GENERAL AUTHENTICATED ROUTES ---
// Route for the currently logged-in user to get their own profile and data.
router.get("/me", auth_middleware_1.authMiddleware, user_controller_1.UserControllers.getMe);
// Route for a user to sync their Firebase account with the local DB after signup or login.
router.post("/sync", auth_middleware_1.authMiddleware, user_controller_1.UserControllers.sync);
// --- ADMIN-ONLY ROUTES ---
// These routes are protected by an additional adminMiddleware check.
// Route for an ADMIN to get a paginated and searchable list of all users.
router.get("/", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, user_controller_1.UserControllers.getAll);
// Route for an ADMIN to get a specific user's details by their ID.
router.get("/:userId", auth_middleware_1.authMiddleware, user_controller_1.UserControllers.getUserById);
// Route for an ADMIN to update another user's role.
router.put("/:userId/role", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, user_controller_1.UserControllers.updateUserRole);
// Route for an ADMIN to permanently delete a user from Firebase and the local database.
router.delete("/:userId", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, user_controller_1.UserControllers.deleteUser);
exports.default = router;
//# sourceMappingURL=user.route.js.map