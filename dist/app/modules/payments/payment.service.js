"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentServices = void 0;
const stripe_1 = __importDefault(require("stripe"));
const order_service_1 = require("../orders/order.service");
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const product_model_1 = __importDefault(require("../products/product.model"));
const user_service_1 = require("../user/user.service");
const database_1 = __importDefault(require("../../database"));
const notification_service_1 = require("../notification/notification.service");
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY);
/**
 * Creates an order and all associated records from a completed Stripe session.
 * This is the primary function called by the webhook handler.
 */
const createOrderFromStripeSession = async (session) => {
    const t = await database_1.default.transaction();
    try {
        console.log(`[WEBHOOK] Step 1: Starting order creation for session ${session.id}`);
        const metadata = session.metadata;
        const cart = JSON.parse(metadata.cart ?? '[]');
        const profileInfo = JSON.parse(metadata.profileInfo ?? '{}');
        const shippingCost = parseFloat(metadata.shippingCost ?? '0');
        const firebaseUID = metadata.firebaseUID;
        if (!firebaseUID) {
            throw new Error("Firebase UID is missing from webhook metadata.");
        }
        // Step 2: Sync User and Profile
        console.log(`[WEBHOOK] Step 2: Syncing user and profile for email: ${profileInfo.email}`);
        const user = await user_service_1.UserServices.syncUser({
            firebaseUID: firebaseUID,
            email: profileInfo.email,
            name: `${profileInfo.firstName} ${profileInfo.lastName}`,
            profileData: profileInfo,
        });
        const profile = user.profile;
        if (!profile) {
            throw new Error("Failed to sync user and retrieve profile during webhook processing.");
        }
        console.log(`[WEBHOOK]  -> Profile #${profile.get('id')} found or created.`);
        // Step 3: Create Transaction
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
        const transaction = await transaction_model_1.default.create({ transactionId: paymentIntent.id }, { transaction: t });
        console.log(`[WEBHOOK]  -> Transaction #${transaction.get('id')} created.`);
        // Step 4: Calculate totals
        const subtotal = (session.amount_subtotal || 0) / 100;
        const total_items = cart.reduce((sum, item) => sum + item.quantity, 0);
        const productIds = cart.map((p) => p.productId);
        const productsInDb = await product_model_1.default.findAll({ where: { id: productIds }, transaction: t });
        const total_weight = productsInDb.reduce((sum, dbProduct) => {
            const cartItem = cart.find((item) => item.productId === dbProduct.get("id"));
            return sum + (parseFloat(dbProduct.get("weight")) * (cartItem?.quantity || 0));
        }, 0);
        // Step 5: Create Order
        const orderPayload = {
            order_no: Date.now(),
            total: subtotal,
            shippingCost: shippingCost,
            payment_status: "PAID",
            fulfillmentStatus: "PENDING",
            total_items,
            weight: total_weight,
            profileId: profile.get('id'),
            transactionId: transaction.get('id'),
            deliveryMethod: "Standard",
            products: cart,
        };
        const order = await order_service_1.OrderServices.createOrderInDB(orderPayload, { transaction: t });
        await notification_service_1.NotificationServices.createNotification('NEW_ORDER', `New order #${order.get('order_no')} for £${(Number(order.get('total')) + Number(order.get('shippingCost'))).toFixed(2)} received.`, order.get('id'));
        console.log(`[WEBHOOK]  -> Order #${orderPayload.order_no} created.`);
        // Step 6: Update product stock
        for (const item of cart) {
            await product_model_1.default.decrement("quantity", { by: item.quantity, where: { id: item.productId }, transaction: t });
        }
        console.log("[WEBHOOK]  -> Stock updated.");
        await t.commit();
        console.log(`[WEBHOOK] ✅ Transaction committed successfully for session ${session.id}`);
    }
    catch (error) {
        await t.rollback();
        console.error("❌ Order creation failed. Transaction rolled back. Full error:", error);
        throw new Error("Failed to process order from Stripe session.");
    }
};
/**
 * Verifies a Stripe session and retrieves the corresponding order.
 * Implements a retry mechanism to handle webhook delays.
 */
const verifyStripeSession = async (sessionId, maxRetries = 5) => {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log("++++++++++++++++++++++++ session in verify stripe session", session);
    if (!session.payment_intent) {
        throw new Error('Payment intent not found in session.');
    }
    if (session.payment_status !== 'paid') {
        throw new Error('Payment was not completed successfully.');
    }
    const paymentIntentId = session.payment_intent;
    // Retry logic to give the webhook time to process
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        console.log(`Verification attempt ${attempt}/${maxRetries} for session ${sessionId}`);
        const transaction = await transaction_model_1.default.findOne({
            where: { transactionId: paymentIntentId }
        });
        if (transaction) {
            const order = await order_service_1.OrderServices.getOrderByTransactionId(transaction.get('id'));
            if (order) {
                console.log(`✅ Order found for session ${sessionId}`);
                return order;
            }
        }
        // If it's not the last attempt, wait for 2 seconds before trying again
        if (attempt < maxRetries) {
            console.log(`Transaction not found, waiting 2 seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    // If all retries fail, throw the final error.
    throw new Error('Transaction not found. Your order is still being processed.');
};
exports.PaymentServices = {
    createOrderFromStripeSession,
    verifyStripeSession,
};
//# sourceMappingURL=payment.service.js.map