import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Package, Loader2, Calendar, IndianRupee, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/user');
        setOrders(data);
      } catch (error) {
        toast.error('Failed to load orders');
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'Processing': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
      case 'Shipped': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
      case 'Delivered': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'Cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return t('orders.pending');
      case 'Processing': return t('orders.processing');
      case 'Shipped': return t('orders.shipped');
      case 'Delivered': return t('orders.delivered');
      case 'Cancelled': return t('orders.cancelled');
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-industrial-orange" size={48} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Package size={32} className="text-industrial-orange" />
        <h1 className="text-3xl font-bold text-white">{t('orders.title')}</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-industrial-800 p-12 rounded-2xl border border-industrial-700 text-center shadow-xl">
          <Package size={64} className="mx-auto text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">{t('orders.empty')}</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {t('orders.emptyDesc')}
          </p>
          <Link to="/products" className="btn-primary inline-flex">
            {t('orders.shopNow')}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-industrial-800 rounded-2xl border border-industrial-700 overflow-hidden shadow-xl transition-all hover:border-industrial-orange/30">
              <div className="bg-industrial-900/50 p-6 border-b border-industrial-700 flex flex-wrap justify-between items-center gap-4">
                <div>
                  <p className="text-sm text-gray-400 font-semibold mb-1">{t('orders.orderId')}</p>
                  <p className="text-white font-mono">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-semibold mb-1">{t('orders.date')}</p>
                  <p className="text-white flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-semibold mb-1">{t('orders.totalAmount')}</p>
                  <p className="text-industrial-orange font-bold text-lg flex items-center">
                    <IndianRupee size={16} className="mr-1" />
                    {order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className={`px-4 py-2 rounded-full border text-sm font-bold ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-industrial-700 pb-2">{t('orders.items')}</h3>
                    <div className="space-y-4">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-4">
                          {item.product && item.product.image ? (
                             <img src={item.product.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-industrial-900 border border-industrial-700" />
                          ) : (
                             <div className="w-16 h-16 flex items-center justify-center bg-industrial-900 rounded border border-industrial-700 text-gray-500">
                               <Package size={24} />
                             </div>
                          )}
                          <div>
                            <p className="text-white font-semibold">{item.name}</p>
                            <p className="text-gray-400 text-sm">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 border-b border-industrial-700 pb-2">{t('orders.shippingDetails')}</h3>
                    <div className="bg-industrial-900 rounded-lg p-4 border border-industrial-700 text-gray-300">
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-industrial-orange mt-1 shrink-0" />
                        <div>
                          <p className="font-semibold text-white mb-1">{order.shippingAddress.fullName || 'User'}</p>
                          <p>{order.shippingAddress.address}</p>
                          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
