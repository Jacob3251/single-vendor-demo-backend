export declare const StatsServices: {
    getDashboardStats: () => Promise<{
        stats: {
            unfulfilledOrders: number;
            dispatchedToday: number;
            ordersToday: number;
            revenueThisMonth: number;
        };
        bestSellers: {
            name: any;
            sales: number;
        }[];
        salesData: {
            name: any;
            sales: number;
        }[];
    }>;
};
//# sourceMappingURL=stats.service.d.ts.map