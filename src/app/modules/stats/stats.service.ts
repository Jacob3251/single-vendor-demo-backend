import { Op, fn, col } from 'sequelize';
import Order from '../orders/order.model';
import Product from '../products/product.model';
import OrderProduct from '../orders/order_product.model';
import { startOfDay, startOfMonth, subMonths } from 'date-fns';

/**
 * Calculates all the key metrics for the main dashboard.
 * @returns An object containing various dashboard statistics.
 */
const getDashboardStats = async () => {
  const now = new Date();

  // 1. Stat Card Metrics
  const unfulfilledOrders = await Order.count({
    where: { fulfillmentStatus: 'PENDING' },
  });

  const dispatchedToday = await Order.count({
    where: {
      fulfillmentStatus: 'DISPATCHED',
      updatedAt: { [Op.gte]: startOfDay(now) },
    },
  });

  const ordersToday = await Order.count({
    where: {
      createdAt: { [Op.gte]: startOfDay(now) },
    },
  });

  const revenueThisMonth = await Order.sum('total', {
    where: {
      payment_status: 'PAID',
      createdAt: { [Op.gte]: startOfMonth(now) },
    },
  });

  // 2. Best Sellers (Top 4 products by quantity sold)
  const bestSellersData = await OrderProduct.findAll({
    attributes: [
      'productId',
      // ✅ FIX: Explicitly specify the table for the 'quantity' column
      // to resolve the ambiguity. We want to sum the quantity from the OrderProduct table.
      [fn('SUM', col('OrderProduct.quantity')), 'totalSold'],
    ],
    group: ['productId'],
    order: [[fn('SUM', col('OrderProduct.quantity')), 'DESC']],
    limit: 4,
    include: [{ model: Product, as: 'product', attributes: ['name'] }],
  });
  
  const bestSellers = bestSellersData.map((item: any) => ({
      name: item.product ? item.product.name : 'Unknown Product',
      sales: parseInt(item.get('totalSold'), 10),
  }));

  // 3. Monthly Sales Chart (Sales for the last 6 months)
  const sixMonthsAgo = subMonths(now, 5);
  const monthlySalesRaw = await Order.findAll({
    where: {
      payment_status: 'PAID',
      createdAt: { [Op.gte]: startOfMonth(sixMonthsAgo) },
    },
    attributes: [
      [fn('SUM', col('total')), 'sales'],
      [fn('MONTHNAME', col('createdAt')), 'month'], // Note: MONTHNAME is MySQL-specific
      [fn('YEAR', col('createdAt')), 'year'],
      [fn('MONTH', col('createdAt')), 'month_numeric'],
    ],
    group: [
        'year',
        'month',
        'month_numeric'
    ],
    order: [
        ['year', 'ASC'],
        ['month_numeric', 'ASC']
    ],
    raw: true,
  });
  
  const salesData = monthlySalesRaw.map((entry: any) => ({
      name: entry.month.substring(0, 3),
      sales: parseFloat(entry.sales),
  }));

  return {
    stats: {
      unfulfilledOrders,
      dispatchedToday,
      ordersToday,
      revenueThisMonth: revenueThisMonth || 0,
    },
    bestSellers,
    salesData,
  };
};

export const StatsServices = {
  getDashboardStats,
};

