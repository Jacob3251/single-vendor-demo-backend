import express from "express";
import { ShippingControllers } from "./shipping.controller";

const router = express.Router();

// Route to create a new shipping dispatch from a list of order IDs
router.post("/dispatch", ShippingControllers.createShippingDispatch);

// Route to update the status of an entire shipping batch to "SHIPPED"
router.put("/:id/shipped", ShippingControllers.updateShippingStatusToShipped);

export default router;
