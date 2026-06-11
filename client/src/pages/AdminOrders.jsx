import { useState, useEffect } from 'react';
import api from '../services/api';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}`, { status });
      toast.success('Order status updated');
      fetchData(); 
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status');
    }
  };

  const downloadCSV = () => {
    if (orders.length === 0) {
      toast.error("No orders to download");
      return;
    }
    
    const headers = ['Order ID', 'Date', 'User Email', 'Total Price', 'Status', 'Products Included'];
    const rows = orders.map(order => [
      order._id,
      new Date(order.createdAt).toLocaleDateString(),
      order.userId?.email || 'N/A',
      order.totalPrice,
      order.status,
      order.products.map(p => `${p.productId?.name} (x${p.quantity})`).join(' | ')
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => `"${e.join('","')}"`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sales_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-xl text-gray-400">Loading Orders...</div>;

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold">Order Management</h2>
          <button onClick={downloadCSV} className="flex items-center gap-2 btn-secondary">
            <Download size={18} /> Download CSV Report
          </button>
        </div>
        
        <div className="bg-industrial-800 rounded-lg overflow-hidden border border-industrial-700">
          <table className="w-full text-left text-sm">
            <thead className="bg-industrial-900">
              <tr>
                <th className="p-4 border-b border-industrial-700">Order ID</th>
                <th className="p-4 border-b border-industrial-700">User</th>
                <th className="p-4 border-b border-industrial-700">Total</th>
                <th className="p-4 border-b border-industrial-700">Status</th>
                <th className="p-4 border-b border-industrial-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className="border-b border-industrial-700 hover:bg-industrial-700/50">
                  <td className="p-4 font-mono">{order._id.substring(0, 8)}...</td>
                  <td className="p-4">{order.userId?.name || 'Unknown'}</td>
                  <td className="p-4 font-bold text-industrial-orange">₹{order.totalPrice.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      order.status === 'Completed' ? 'bg-green-900 text-green-300' :
                      order.status === 'Processing' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-gray-700 text-gray-300'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <select 
                      className="bg-industrial-900 border border-industrial-700 rounded text-sm p-1 text-white"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No orders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
