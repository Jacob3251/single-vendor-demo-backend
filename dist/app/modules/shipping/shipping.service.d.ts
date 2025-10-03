import Shipping from "./shipping.model";
import { Transaction } from "sequelize";
export declare const ShippingServices: {
    createShippingDispatch: (orderIds: number[], shippingMedium?: string) => Promise<{
        message: string;
    }>;
    updateShippingStatusToShipped: (shippingId: number) => Promise<Shipping>;
    createDispatchRecords: (orderIds: number[], shippingMedium: string, transaction: Transaction) => Promise<void>;
};
//# sourceMappingURL=shipping.service.d.ts.map