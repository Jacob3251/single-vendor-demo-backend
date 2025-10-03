import { Model } from "sequelize";
declare class Notification extends Model {
    id: number;
    type: 'NEW_ORDER' | 'LOW_STOCK' | 'NEW_USER';
    message: string;
    isRead: boolean;
    entityId: number;
}
export default Notification;
//# sourceMappingURL=notification.model.d.ts.map