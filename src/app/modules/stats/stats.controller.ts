import { Request, Response, NextFunction } from 'express';
import { StatsServices } from './stats.service';

const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await StatsServices.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
};

export const StatsControllers = {
  getDashboardStats,
};
