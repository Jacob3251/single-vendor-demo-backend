import Transaction from "./transaction.model";
import Stripe from "stripe";
export declare const TransactionServices: {
    createTransaction: (paymentIntent: Stripe.PaymentIntent) => Promise<Transaction>;
    getAllTransactions: () => Promise<Transaction[]>;
    getTransactionById: (id: number) => Promise<Transaction | null>;
};
//# sourceMappingURL=transaction.service.d.ts.map