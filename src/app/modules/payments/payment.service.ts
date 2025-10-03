import Stripe from 'stripe';
import { OrderServices } from '../orders/order.service';
import { ProfileServices } from '../profile/profile.service';
import TransactionModel from '../transaction/transaction.model';
import Product from '../products/product.model';
import { UserServices } from '../user/user.service';
import sequelize from '../../database';
import Profile from '../profile/profile.model';
import { NotificationServices } from '../notification/notification.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Creates an order and all associated records from a completed Stripe session.
 * This is the primary function called by the webhook handler.
 */
const createOrderFromStripeSession = async (session: Stripe.Checkout.Session) => {
  const t = await sequelize.transaction();
  try {
    console.log(`[WEBHOOK] Step 1: Starting order creation for session ${session.id}`);
    const metadata = session.metadata!;
    const cart = JSON.parse(metadata.cart ?? '[]');
    const profileInfo = JSON.parse(metadata.profileInfo ?? '{}');
    const shippingCost = parseFloat(metadata.shippingCost ?? '0');
    const firebaseUID = metadata.firebaseUID;

    if (!firebaseUID) {
      throw new Error("Firebase UID is missing from webhook metadata.");
    }

    // Step 2: Sync User and Profile
    console.log(`[WEBHOOK] Step 2: Syncing user and profile for email: ${profileInfo.email}`);
    const user = await UserServices.syncUser({
      firebaseUID: firebaseUID,
      email: profileInfo.email,
      name: `${profileInfo.firstName} ${profileInfo.lastName}`,
      profileData: profileInfo,
    });

    const profile = (user as any).profile as Profile;
    if (!profile) {
      throw new Error("Failed to sync user and retrieve profile during webhook processing.");
    }
    console.log(`[WEBHOOK]  -> Profile #${profile.get('id')} found or created.`);

    // Step 3: Create Transaction
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
    const transaction = await TransactionModel.create(
      { transactionId: paymentIntent.id },
      { transaction: t }
    );
    console.log(`[WEBHOOK]  -> Transaction #${transaction.get('id')} created.`);
    
    // Step 4: Calculate totals
    const subtotal = (session.amount_subtotal || 0) / 100;
    const total_items = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    const productIds = cart.map((p: any) => p.productId);
    const productsInDb = await Product.findAll({ where: { id: productIds }, transaction: t });
    const total_weight = productsInDb.reduce((sum: number, dbProduct: any) => {
        const cartItem = cart.find((item: any) => item.productId === dbProduct.get("id"));
        return sum + (parseFloat(dbProduct.get("weight") as any) * (cartItem?.quantity || 0));
    }, 0);

    // Step 5: Create Order
    const orderPayload = {
      order_no: Date.now(),
      total: subtotal,
      shippingCost: shippingCost,
      payment_status: "PAID" as const,
      fulfillmentStatus: "PENDING" as const,
      total_items,
      weight: total_weight,
      profileId: profile.get('id') as number,
      transactionId: transaction.get('id') as number,
      deliveryMethod: "Standard",
      products: cart,
    };
    const order = await OrderServices.createOrderInDB(orderPayload, { transaction: t });

    await NotificationServices.createNotification(
        'NEW_ORDER',
        `New order #${order.get('order_no')} for £${(Number(order.get('total')) + Number(order.get('shippingCost'))).toFixed(2)} received.`,
        order.get('id') as number
    );
    console.log(`[WEBHOOK]  -> Order #${orderPayload.order_no} created.`);

    // Step 6: Update product stock
    for (const item of cart) {
      await Product.decrement("quantity", { by: item.quantity, where: { id: item.productId }, transaction: t });
    }
    console.log("[WEBHOOK]  -> Stock updated.");

    await t.commit();
    console.log(`[WEBHOOK] ✅ Transaction committed successfully for session ${session.id}`);

  } catch (error) {
    await t.rollback();
    console.error("❌ Order creation failed. Transaction rolled back. Full error:", error);
    throw new Error("Failed to process order from Stripe session.");
  }
};

/**
 * Verifies a Stripe session and retrieves the corresponding order.
 * Implements a retry mechanism to handle webhook delays.
 */
const verifyStripeSession = async (sessionId: string, maxRetries: number = 5): Promise<any> => {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  console.log("++++++++++++++++++++++++ session in verify stripe session", session)
  if (!session.payment_intent) {
    throw new Error('Payment intent not found in session.');
  }
  
  if (session.payment_status !== 'paid') {
    throw new Error('Payment was not completed successfully.');
  }

  const paymentIntentId = session.payment_intent as string;

  // Retry logic to give the webhook time to process
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`Verification attempt ${attempt}/${maxRetries} for session ${sessionId}`);
    
    const transaction = await TransactionModel.findOne({ 
      where: { transactionId: paymentIntentId } 
    });

    if (transaction) {
      const order = await OrderServices.getOrderByTransactionId(transaction.get('id') as number);
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

export const PaymentServices = {
  createOrderFromStripeSession,
  verifyStripeSession,
};

