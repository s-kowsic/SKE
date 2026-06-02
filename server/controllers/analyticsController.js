const Order = require('../models/Order');

const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    
    const totalSales = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalOrders = orders.length;

    // Calculate monthly revenue for charts
    const monthlyRevenue = Array(12).fill(0);
    
    orders.forEach(order => {
      if (order.status !== 'Pending') {
        const month = new Date(order.createdAt).getMonth(); // 0-11
        monthlyRevenue[month] += order.totalPrice;
      }
    });

    res.json({
      totalSales,
      totalOrders,
      monthlyRevenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
