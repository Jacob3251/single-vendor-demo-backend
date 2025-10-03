import express from "express";
import productRoutes from "./products/product.route";
import collectionRoutes from "./collections/collection.route";
import brandRoutes from "./brands/brand.route";
import blogRoutes from "./blog/blog.route";
import userRoutes from "./user/user.route";
import orderRoutes from "./orders/order.route";
import shippingRoute from "./shipping/shipping.route";
import transsactionRoutes from "./transaction/transaction.route";
import profileRoutes from "./profile/profile.route";
import statsRoutes from "./stats/stats.route";
import paymentRoutes from "./payments/payments.route";
import notificationRoutes from "./notification/notification.route";
import siteSettingsRouter from "./siteSettings/siteSettings.route";
const router = express.Router();
// New, recommended code

router.use("/site-settings", siteSettingsRouter);
router.use("/products", productRoutes);
router.use("/collections",collectionRoutes );
router.use("/brands", brandRoutes);
router.use("/orders", orderRoutes);
router.use("/shipping", shippingRoute);
router.use("/profile", profileRoutes);

router.use("/blogs", blogRoutes);
router.use("/payments", paymentRoutes);
router.use("/users", userRoutes);
router.use("/transactions", transsactionRoutes);
router.use("/stats", statsRoutes);
router.use("/notifications", notificationRoutes);
export default router;