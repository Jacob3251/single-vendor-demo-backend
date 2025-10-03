"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionServices = void 0;
const transaction_model_1 = __importDefault(require("./transaction.model"));
/**
 * Creates a transaction record in the database from a Stripe payment intent.
 * @param {Stripe.PaymentIntent} paymentIntent - The successful payment intent object from Stripe.
 * @returns {Promise<Transaction>} The created transaction instance.
 */
const createTransaction = async (paymentIntent) => {
    const transaction = await transaction_model_1.default.create({
        transactionId: paymentIntent.id,
        transactionTime: new Date(paymentIntent.created * 1000), // Convert Unix timestamp to Date
    });
    return transaction;
};
const getAllTransactions = async () => {
    return transaction_model_1.default.findAll({
        order: [["transactionTime", "DESC"]],
    });
};
const getTransactionById = async (id) => {
    return transaction_model_1.default.findByPk(id);
};
exports.TransactionServices = {
    createTransaction,
    getAllTransactions,
    getTransactionById,
};
//# sourceMappingURL=transaction.service.js.map