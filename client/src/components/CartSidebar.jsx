import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, CheckCircle, Plus, Minus, CreditCard, Shield } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CartSidebar({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to checkout.");
      return;
    }
    if (cart.length === 0) return;

    try {
      setIsProcessing(true);

      // Step 1: Create Razorpay order on the server
      const { data } = await api.post('/payment/create-order', {
        amount: cartTotal,
        cartItems: cart.map(item => ({ id: item._id, quantity: item.quantity })),
      });

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Sri Krishna Engineering',
        description: `Order - ${cart.length} item(s)`,
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const verifyData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              products: cart.map(item => ({
                productId: item._id,
                quantity: item.quantity,
                priceAtPurchase: item.price,
              })),
              totalPrice: cartTotal,
            };
            await api.post('/payment/verify', verifyData);
            setIsSuccess(true);
            clearCart();
            toast.success('Payment successful!', { icon: '✅' });
            setTimeout(() => {
              setIsSuccess(false);
              onClose();
            }, 3000);
          } catch (err) {
            console.error('Payment verification failed:', err);
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        theme: {
          color: '#F97316',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast('Payment cancelled.', { icon: '⚠️' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
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
          <p className="text-gray-400">Payment verified. Your order is being processed.</p>
        </div>
      ) : (
        <>
          <div className="p-4 overflow-y-auto h-[calc(100vh-180px)]">
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
            <div className="flex justify-between mb-3 font-bold text-lg">
              <span>Total:</span>
              <span className="text-industrial-orange">₹{cartTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0 || isProcessing}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                'Processing...'
              ) : (
                <><CreditCard size={18} /> Pay ₹{cartTotal.toFixed(2)}</>
              )}
            </button>
            <div className="flex items-center justify-center gap-1.5 mt-2 text-[10px] text-gray-500">
              <Shield size={10} />
              <span>Secured by Razorpay</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
