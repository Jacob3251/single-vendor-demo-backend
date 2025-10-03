import Order from '../modules/orders/order.model';
import Profile from '../modules/profile/profile.model';
import Shipping from '../modules/shipping/shipping.model';
export declare const EmailServices: {
    sendDispatchNotification: (order: Order, profile: Profile) => Promise<void>;
    sendDeliveryNotification: (order: Order, profile: Profile, shipping: Shipping) => Promise<void>;
};
//# sourceMappingURL=email.service.d.ts.map