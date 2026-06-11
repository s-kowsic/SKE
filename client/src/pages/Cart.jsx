import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, CheckCircle, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout.");
      return;
    }
    try {
      setIsProcessing(true);
      const orderData = {
        products: cart.map(item => ({ productId: item._id, quantity: item.quantity, priceAtPurchase: item.price })),
        totalPrice: cartTotal
      };
      await api.post('/orders', orderData);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error(error);
      toast.error('Checkout failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center animate-fade-in">
        <CheckCircle size={80} className="text-green-500 mb-6" />
        <h2 className="text-4xl font-bold mb-4 text-white">Order Confirmed!</h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md">
          Thank you for your purchase. Your order has been placed successfully and is currently being processed.
        </p>
        <Link to={`/u/${user.userid}/orders`} className="btn-primary inline-flex items-center gap-2">
          View Orders <ArrowRight size={20} />
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBag size={32} className="text-industrial-orange" />
        <h1 className="text-3xl font-bold text-white">{t('cart.title')}</h1>
      </div>

      {cart.length === 0 ? (
        <div className="bg-industrial-800 border border-industrial-700 rounded-xl p-12 text-center">
          <ShoppingBag size={64} className="text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('cart.empty')}</h2>
          <p className="text-gray-400 mb-6">{t('cart.emptyDesc')}</p>
          <Link to="/products" className="btn-primary inline-block">
            {t('cart.continueShopping')}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item._id} className="bg-industrial-800 border border-industrial-700 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 shadow-sm hover:border-industrial-600 transition-colors">
                <div className="w-24 h-24 bg-industrial-900 rounded-lg overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No Image</div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="text-xs text-industrial-orange font-bold uppercase mb-1">{item.type}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{item.name}</h3>
                  <div className="flex items-center gap-3 mt-2">
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                      disabled={item.quantity <= 1}
                      className="p-1 bg-industrial-900 border border-industrial-700 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                      disabled={item.quantity >= (item.stockQuantity || 999)}
                      className="p-1 bg-industrial-900 border border-industrial-700 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="text-right sm:text-right w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between">
                  <p className="text-xl font-bold text-white mb-2">₹{(item.price * item.quantity).toFixed(2)}</p>
                  <button 
                    onClick={() => removeFromCart(item._id)} 
                    className="text-red-500 hover:text-red-400 p-2 rounded-full hover:bg-industrial-900 transition-colors"
                    title={t('cart.remove')}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-96">
            <div className="bg-industrial-800 border border-industrial-700 rounded-xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-industrial-700 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>{t('cart.subtotal')} ({cart.length} {t('cart.items')})</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>{t('cart.shipping')}</span>
                  <span className="text-green-500">{t('cart.free')}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-industrial-700 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">{t('cart.total')}</span>
                    <span className="text-2xl sm:text-3xl font-bold text-industrial-orange">₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isProcessing || cart.length === 0}
                className="w-full btn-primary py-4 text-lg font-bold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? t('common.loading') : t('cart.checkout')}
              </button>
              
              <p className="text-xs text-gray-500 mt-4 text-center">
                Secure checkout powered by Sri Krishna Engineering.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
