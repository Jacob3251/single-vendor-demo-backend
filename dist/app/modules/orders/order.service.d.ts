import Order from "./order.model";
import { Transaction as SequelizeTransaction } from "sequelize";
interface UpdateOrderPayload {
    fulfillmentStatus?: "PENDING" | "DISPATCHED" | "SHIPPED";
    trackingId?: string | null;
    emailStatus?: "ConfirmOrder" | "ShippingDetails" | "Delivery";
    weight?: number;
    deliveryCompany?: string;
}
interface ManualOrderPayload {
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        postalCode: string;
    };
    transactionId: string;
    products: {
        productId: number;
        quantity: number;
        price: number;
        weight: number;
    }[];
    deliveryMethod: string;
}
export declare const OrderServices: {
    createManualOrderInDB: (payload: ManualOrderPayload) => Promise<Order>;
    createOrderInDB: (payload: any, options: {
        transaction: SequelizeTransaction;
    }) => Promise<Order>;
    getAllOrdersFromDB: (options: {
        searchTerm?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) => Promise<{
        orders: Order[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    getOrderByIdFromDB: (id: number) => Promise<Order | null>;
    getOrdersByUserId: (userId: string) => Promise<Order[]>;
    getOrderByTransactionId: (transactionId: number) => Promise<Order | null>;
    updateOrderInDB: (id: number, payload: UpdateOrderPayload) => Promise<Order>;
    bulkUpdateOrderStatus: (orderIds: number[], status: "DISPATCHED" | "SHIPPED", shippingMedium?: string) => Promise<{
        message: string;
    }>;
    generateShippingCsv: (orderIds: number[]) => Promise<string>;
    sendDeliveryEmail: (orderId: number) => Promise<{
        message: string;
    }>;
};
export {};
//# sourceMappingURL=order.service.d.ts.map