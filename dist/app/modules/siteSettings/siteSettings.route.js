"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const siteSettings_controller_1 = require("./siteSettings.controller");
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const admin_middleware_1 = require("../../middlewares/admin.middleware");
const router = (0, express_1.Router)();
// Public: get all site settings
router.get("/", siteSettings_controller_1.getAll);
// Protected update (admin only)
// Example: PUT /api/v1/site-settings/1
router.put("/:id", auth_middleware_1.authMiddleware, admin_middleware_1.adminMiddleware, siteSettings_controller_1.update);
exports.default = router;
//# sourceMappingURL=siteSettings.route.js.map