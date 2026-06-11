import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, CheckCircle, Plus, Minus } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout.");
      return;
    }
    try {
      const orderData = {
        products: cart.map(item => ({ productId: item._id, quantity: item.quantity, priceAtPurchase: item.price })),
        totalPrice: cartTotal
      };
      await api.post('/orders', orderData);
      setIsSuccess(true);
      clearCart();
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error('Checkout failed.');
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-industrial-900 border-l border-industrial-700 shadow-2xl transform transition-transform duration-300 z-[60] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center p-4 border-b border-industrial-700">
        <h2 className="text-xl font-bold text-white">Your Cart</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X />
        </button>
      </div>

      {isSuccess ? (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
          <CheckCircle size={64} className="text-green-500 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Order Confirmed!</h3>
          <p className="text-gray-400">Thank you for your purchase. We are processing your order.</p>
        </div>
      ) : (
        <>
          <div className="p-4 overflow-y-auto h-[calc(100vh-160px)]">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">Cart is empty.</p>
            ) : (
              cart.map((item) => (
                <div key={item._id} className="flex justify-between items-center mb-4 pb-4 border-b border-industrial-800">
                  <div>
                    <h4 className="font-bold">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity - 1)} 
                        disabled={item.quantity <= 1}
                        className="p-1 bg-industrial-800 border border-industrial-700 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item._id, item.quantity + 1)} 
                        disabled={item.quantity >= (item.stockQuantity || 999)}
                        className="p-1 bg-industrial-800 border border-industrial-700 rounded text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus size={14} />
                      </button>
                      <span className="text-sm text-gray-400 ml-2">x ₹{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
          <div className="absolute bottom-0 w-full p-4 bg-industrial-800 border-t border-industrial-700">
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
