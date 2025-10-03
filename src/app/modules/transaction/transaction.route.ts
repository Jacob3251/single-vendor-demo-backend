import express from "express";
import { TransactionControllers } from "./transaction.controller";

const router = express.Router();

router.get("/", TransactionControllers.getAllTransactions);
router.get("/:id", TransactionControllers.getTransactionById);

export default router;
