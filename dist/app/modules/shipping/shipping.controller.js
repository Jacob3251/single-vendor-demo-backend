"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShippingControllers = void 0;
const shipping_service_1 = require("./shipping.service");
const shipping_validation_1 = require("./shipping.validation"); // Assuming your validation file exists
/**
 * Controller to handle the creation of a new shipping dispatch from a list of order IDs.
 * This is called when an admin clicks the "Dispatch" button.
 */
const createShippingDispatch = async (req, res, next) => {
    try {
        // Validate the incoming payload to ensure it's an array of order IDs
        const { orderIds, shippingMedium } = shipping_validation_1.createShippingDispatchValidationSchema.parse(req.body);
        const result = await shipping_service_1.ShippingServices.createShippingDispatch(orderIds, shippingMedium);
        res.status(201).json({ success: true, message: "Orders dispatched successfully.", data: result });
    }
    catch (error) {
        next(error);
    }
};
/**
 * Controller to update the status of a shipping record to "SHIPPED".
 */
const updateShippingStatusToShipped = async (req, res, next) => {
    try {
        const { id } = req.params;
        const shipping = await shipping_service_1.ShippingServices.updateShippingStatusToShipped(Number(id));
        res.status(200).json({ success: true, message: "Shipping status updated to SHIPPED.", data: shipping });
    }
    catch (error) {
        next(error);
    }
};
exports.ShippingControllers = {
    createShippingDispatch,
    updateShippingStatusToShipped,
};
//# sourceMappingURL=shipping.controller.js.map