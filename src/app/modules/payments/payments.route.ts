import express from "express";
import { PaymentControllers } from "./payments.controller"; // Changed from "./payments.controller"
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

// Route to create a Stripe checkout session (authenticated users)

// Stripe webhook route (must come before any body parsers)
router.post("/webhook", PaymentControllers.handleStripeWebhook);

router.post("/create-checkout-session", authMiddleware, PaymentControllers.createCheckoutSession);

// Stripe webhook route (no auth needed - Stripe calls this directly)
// This MUST come before other middleware that parses JSON
// In your app.ts - this should come BEFORE express.json()

// Route to verify a payment session (authenticated users)
router.post("/verify-session", authMiddleware, PaymentControllers.verifySession);

export default router;