"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const payments_controller_1 = require("./payments.controller"); // Changed from "./payments.controller"
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = express_1.default.Router();
// Route to create a Stripe checkout session (authenticated users)
// Stripe webhook route (must come before any body parsers)
router.post("/webhook", payments_controller_1.PaymentControllers.handleStripeWebhook);
router.post("/create-checkout-session", auth_middleware_1.authMiddleware, payments_controller_1.PaymentControllers.createCheckoutSession);
// Stripe webhook route (no auth needed - Stripe calls this directly)
// This MUST come before other middleware that parses JSON
// In your app.ts - this should come BEFORE express.json()
// Route to verify a payment session (authenticated users)
router.post("/verify-session", auth_middleware_1.authMiddleware, payments_controller_1.PaymentControllers.verifySession);
exports.default = router;
//# sourceMappingURL=payments.route.js.map