import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Loader2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RestockModal({ isOpen, onClose, product }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/contact/restock', {
        email,
        productId: product._id,
        productName: product.name,
      });
      toast.success('You will be notified when this item is back in stock!');
      onClose();
      if (!user) setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request notification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-industrial-800 border border-industrial-700 rounded-2xl p-6 md:p-8 w-full max-w-md relative shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 bg-industrial-900 rounded-full flex items-center justify-center text-industrial-orange mb-4 border border-industrial-700 shadow-inner">
              <Bell size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Notify Me</h3>
            {user ? (
              <p className="text-gray-400 text-sm">
                We will send a notification to your registered email (<strong>{user.email}</strong>) as soon as <strong>{product?.name}</strong> is back in stock.
              </p>
            ) : (
              <p className="text-gray-400 text-sm">
                We'll send you an email as soon as <strong>{product?.name}</strong> is back in stock.
              </p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!user && (
              <div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-industrial-900 border border-industrial-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-industrial-orange transition-colors"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 rounded-xl"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (user ? 'Confirm Notification' : 'Notify When Available')}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
