"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsControllers = void 0;
const stats_service_1 = require("./stats.service");
const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await stats_service_1.StatsServices.getDashboardStats();
        res.status(200).json({ success: true, data: stats });
    }
    catch (error) {
        next(error);
    }
};
exports.StatsControllers = {
    getDashboardStats,
};
//# sourceMappingURL=stats.controller.js.map