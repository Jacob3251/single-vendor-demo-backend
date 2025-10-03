import Stripe from 'stripe';
export declare const PaymentServices: {
    createOrderFromStripeSession: (session: Stripe.Checkout.Session) => Promise<void>;
    verifyStripeSession: (sessionId: string, maxRetries?: number) => Promise<any>;
};
//# sourceMappingURL=payment.service.d.ts.map