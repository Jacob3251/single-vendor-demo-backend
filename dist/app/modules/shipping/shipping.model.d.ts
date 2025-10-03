import { Model } from "sequelize";
declare class Shipping extends Model {
    id: number;
    orderId: number;
    shippingMedium: string;
    trackingId: string | null;
    shippingTime: Date | null;
    status: 'DISPATCHED' | 'SHIPPED';
}
export default Shipping;
//# sourceMappingURL=shipping.model.d.ts.map