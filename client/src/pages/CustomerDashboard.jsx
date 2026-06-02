import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/user');
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="p-8 text-center text-xl text-gray-400">Loading your profile...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-industrial-800 p-8 rounded-lg border border-industrial-700 mb-8">
        <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}</h2>
        <p className="text-gray-400">Email: {user?.email}</p>
      </div>

      <h3 className="text-2xl font-bold mb-6">Your Order History</h3>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-industrial-800 p-6 rounded-lg border border-industrial-700 flex flex-col md:flex-row justify-between md:items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-400 font-mono mb-1">Order #{order._id}</p>
                <p className="text-lg font-bold">₹{order.totalPrice.toFixed(2)}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Items: {order.products.map(p => p.productId?.name).join(', ')}
                </p>
              </div>
              <div className="text-right">
                <span className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                  order.status === 'Completed' ? 'bg-green-900 text-green-300' :
                  order.status === 'Processing' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-gray-700 text-gray-300'
                }`}>
                  {order.status}
                </span>
                <p className="text-xs text-gray-500 mt-2">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
