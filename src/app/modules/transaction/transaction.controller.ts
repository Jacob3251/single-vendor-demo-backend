import { Request, Response, NextFunction } from "express";
import { TransactionServices } from "./transaction.service";

const getAllTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const transactions = await TransactionServices.getAllTransactions(); // Assumes this service will be created
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const transaction = await TransactionServices.getTransactionById(Number(id)); // Assumes this service will be created
    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

export const TransactionControllers = {
  getAllTransactions,
  getTransactionById,
};
