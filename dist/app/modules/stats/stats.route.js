"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stats_controller_1 = require("./stats.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = express_1.default.Router();
// This route is protected and only accessible to administrators.
router.get('/dashboard', auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, stats_controller_1.StatsControllers.getDashboardStats);
exports.default = router;
//# sourceMappingURL=stats.route.js.map