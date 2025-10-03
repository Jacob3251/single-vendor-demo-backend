import Transaction from "./transaction.model";
import Stripe from "stripe";

/**
 * Creates a transaction record in the database from a Stripe payment intent.
 * @param {Stripe.PaymentIntent} paymentIntent - The successful payment intent object from Stripe.
 * @returns {Promise<Transaction>} The created transaction instance.
 */
const createTransaction = async (
  paymentIntent: Stripe.PaymentIntent
): Promise<Transaction> => {
  const transaction = await Transaction.create({
    transactionId: paymentIntent.id,
    transactionTime: new Date(paymentIntent.created * 1000), // Convert Unix timestamp to Date
  });
  return transaction;
};
const getAllTransactions = async () => {
  return Transaction.findAll({
    order: [["transactionTime", "DESC"]],
  });
};

const getTransactionById = async (id: number) => {
  return Transaction.findByPk(id);
};
export const TransactionServices = {
  createTransaction,
  getAllTransactions,
  getTransactionById,
};
