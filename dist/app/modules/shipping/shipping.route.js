"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shipping_controller_1 = require("./shipping.controller");
const router = express_1.default.Router();
// Route to create a new shipping dispatch from a list of order IDs
router.post("/dispatch", shipping_controller_1.ShippingControllers.createShippingDispatch);
// Route to update the status of an entire shipping batch to "SHIPPED"
router.put("/:id/shipped", shipping_controller_1.ShippingControllers.updateShippingStatusToShipped);
exports.default = router;
//# sourceMappingURL=shipping.route.js.map