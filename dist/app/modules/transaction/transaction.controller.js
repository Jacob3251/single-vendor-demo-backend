"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionControllers = void 0;
const transaction_service_1 = require("./transaction.service");
const getAllTransactions = async (req, res, next) => {
    try {
        const transactions = await transaction_service_1.TransactionServices.getAllTransactions(); // Assumes this service will be created
        res.status(200).json({ success: true, data: transactions });
    }
    catch (error) {
        next(error);
    }
};
const getTransactionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const transaction = await transaction_service_1.TransactionServices.getTransactionById(Number(id)); // Assumes this service will be created
        res.status(200).json({ success: true, data: transaction });
    }
    catch (error) {
        next(error);
    }
};
exports.TransactionControllers = {
    getAllTransactions,
    getTransactionById,
};
//# sourceMappingURL=transaction.controller.js.map