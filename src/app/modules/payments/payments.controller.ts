import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import Product from "../products/product.model";
import { PaymentServices } from "./payment.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

/**
 * Creates a Stripe checkout session for a customer's cart.
 */
const createCheckoutSession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore - The authMiddleware attaches firebaseUser to the request
    if (!req.firebaseUser?.uid) {
      return res.status(401).json({
        success: false,
        error: { message: "User not authenticated." },
      });
    }

    const { cart, profileInfo } = req.body;
    // @ts-ignore
    const firebaseUID = req.firebaseUser.uid;

    // Fetch product details from your DB to ensure prices and weights are accurate
    const productIds = cart.map((item: any) => item.id);
    const productsFromDb = await Product.findAll({ where: { id: productIds } });

    // --- ✅ STOCK VERIFICATION STEP ---
    // Loop through each item in the customer's cart
    for (const cartItem of cart) {
      const productInDb = productsFromDb.find(p => p.get('id') === cartItem.id);
      
      // Check if the product exists or if the requested quantity exceeds the available stock
      if (!productInDb || (productInDb.get('quantity') as number) < cartItem.qty) {
        // If any item is out of stock, stop the process immediately
        return res.status(400).json({
            success: false,
            error: { 
                message: `Sorry, '${cartItem.name}' is out of stock or has insufficient quantity. Please adjust your cart.` 
            }
        });
      }
    }
    // --- End of Stock Verification ---
    
    const totalWeight = cart.reduce((sum: number, item: any) => {
      const product = productsFromDb.find((p) => p.get("id") === item.id);
      return sum + (parseFloat(product?.get("weight") as any) || 0) * item.qty;
    }, 0);

    // Calculate shipping cost based on your business rules
    let shippingCost = 0;
    if (totalWeight > 0 && totalWeight < 1) shippingCost = 2.99;
    else if (totalWeight >= 1 && totalWeight <= 5) shippingCost = 3.99;
    else if (totalWeight > 5) shippingCost = 5.99;

    // Prepare the list of items for Stripe
    const line_items = cart.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: { name: item.name, images: [item.image] },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: item.qty,
    }));

    // Add the shipping fee as a separate line item
    if (shippingCost > 0) {
      line_items.push({
        price_data: {
          currency: "gbp",
          product_data: { name: "Shipping & Handling" },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Prepare metadata to be securely passed to the webhook
    const cartMetadata = cart.map((item: any) => ({
      productId: item.id,
      quantity: item.qty,
    }));

    console.log("==================== user id", firebaseUID);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/checkout`,
      metadata: {
        cart: JSON.stringify(cartMetadata),
        profileInfo: JSON.stringify(profileInfo),
        shippingCost: shippingCost.toFixed(2),
        firebaseUID: firebaseUID,
      },
    });
    console.log("session======================", session);

    res.status(200).json({
      success: true,
      url: session.url
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handles incoming webhook events from Stripe to confirm payments.
 */
const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`❌ Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle only the successful checkout event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      await PaymentServices.createOrderFromStripeSession(session);
    } catch (err: any) {
      console.error(
        `❌ Webhook processing failed for session ${session.id}:`,
        err
      );
      // Return an error to Stripe to signal a processing failure
      return res
        .status(500)
        .json({ success: false, error: "Webhook processing failed." });
    }
  }

  // Acknowledge receipt of the event
  res.json({ received: true });
};

/**
 * Verifies a payment session after a successful redirect from Stripe.
 */
const verifySession = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: { message: "Session ID is required." },
      });
    }
    const order = await PaymentServices.verifyStripeSession(sessionId);
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    // Return a structured error message to the frontend
    res
      .status(404)
      .json({ success: false, error: { message: (error as Error).message } });
  }
};

export const PaymentControllers = {
  createCheckoutSession,
  handleStripeWebhook,
  verifySession,
};
