"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_route_1 = __importDefault(require("./products/product.route"));
const collection_route_1 = __importDefault(require("./collections/collection.route"));
const brand_route_1 = __importDefault(require("./brands/brand.route"));
const blog_route_1 = __importDefault(require("./blog/blog.route"));
const user_route_1 = __importDefault(require("./user/user.route"));
const order_route_1 = __importDefault(require("./orders/order.route"));
const shipping_route_1 = __importDefault(require("./shipping/shipping.route"));
const transaction_route_1 = __importDefault(require("./transaction/transaction.route"));
const profile_route_1 = __importDefault(require("./profile/profile.route"));
const stats_route_1 = __importDefault(require("./stats/stats.route"));
const payments_route_1 = __importDefault(require("./payments/payments.route"));
const notification_route_1 = __importDefault(require("./notification/notification.route"));
const siteSettings_route_1 = __importDefault(require("./siteSettings/siteSettings.route"));
const router = express_1.default.Router();
// New, recommended code
router.use("/site-settings", siteSettings_route_1.default);
router.use("/products", product_route_1.default);
router.use("/collections", collection_route_1.default);
router.use("/brands", brand_route_1.default);
router.use("/orders", order_route_1.default);
router.use("/shipping", shipping_route_1.default);
router.use("/profile", profile_route_1.default);
router.use("/blogs", blog_route_1.default);
router.use("/payments", payments_route_1.default);
router.use("/users", user_route_1.default);
router.use("/transactions", transaction_route_1.default);
router.use("/stats", stats_route_1.default);
router.use("/notifications", notification_route_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map