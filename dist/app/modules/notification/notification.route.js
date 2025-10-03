"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_controller_1 = require("./notification.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
// These routes are for admins to manage notifications
router.get('/', auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, notification_controller_1.NotificationControllers.getUnread);
router.put('/mark-read', auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, notification_controller_1.NotificationControllers.markAsRead);
exports.default = router;
//# sourceMappingURL=notification.route.js.map