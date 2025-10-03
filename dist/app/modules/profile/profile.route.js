"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profile_controller_1 = require("./profile.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// --- Authenticated User Routes (for managing their own profile) ---
router.get('/me', auth_middleware_1.authMiddleware, profile_controller_1.ProfileControllers.getMyProfile);
router.put('/me', auth_middleware_1.authMiddleware, profile_controller_1.ProfileControllers.updateMyProfile);
// --- Admin-Only Route (for updating any user's profile) ---
router.put('/:userId', auth_middleware_1.authMiddleware, profile_controller_1.ProfileControllers.updateUserProfile);
exports.default = router;
//# sourceMappingURL=profile.route.js.map