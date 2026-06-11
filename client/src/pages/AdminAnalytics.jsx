import { useState, useEffect } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/analytics');
      setAnalytics(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = analytics ? [
    { name: 'Jan', revenue: analytics.monthlyRevenue[0] },
    { name: 'Feb', revenue: analytics.monthlyRevenue[1] },
    { name: 'Mar', revenue: analytics.monthlyRevenue[2] },
    { name: 'Apr', revenue: analytics.monthlyRevenue[3] },
    { name: 'May', revenue: analytics.monthlyRevenue[4] },
    { name: 'Jun', revenue: analytics.monthlyRevenue[5] },
    { name: 'Jul', revenue: analytics.monthlyRevenue[6] },
    { name: 'Aug', revenue: analytics.monthlyRevenue[7] },
    { name: 'Sep', revenue: analytics.monthlyRevenue[8] },
    { name: 'Oct', revenue: analytics.monthlyRevenue[9] },
    { name: 'Nov', revenue: analytics.monthlyRevenue[10] },
    { name: 'Dec', revenue: analytics.monthlyRevenue[11] },
  ] : [];

  if (loading) return <div className="p-8 text-center text-xl text-gray-400">Loading Analytics...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full">
        <h2 className="text-3xl font-bold mb-6">Revenue Overview</h2>
        <div className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }} />
              <Bar dataKey="revenue" fill="#EA580C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 text-center">
            <p className="text-gray-400 mb-2">Total Sales Revenue</p>
            <p className="text-4xl font-bold text-industrial-orange">₹{analytics?.totalSales.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 text-center">
            <p className="text-gray-400 mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-white">{analytics?.totalOrders || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
