import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { ShoppingCart, Eye, Heart, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import RestockModal from './RestockModal';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleNotifyMe = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRestockModalOpen(true);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.success(`${product.name} added to wishlist`);
  };

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <>
      <Link to={`/products/${product._id}`} className="block relative bg-industrial-800 rounded-xl overflow-hidden border border-industrial-700 group hover:border-industrial-orange transition-colors duration-300 shadow-lg hover:shadow-2xl">
        
        {/* Image Container with Hover Actions */}
        <div className="h-56 overflow-hidden bg-industrial-900 relative">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
          )}
          
          {/* Quick action buttons on hover */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-10">
            {isOutOfStock ? (
              <button 
                onClick={handleNotifyMe}
                className="w-12 h-12 bg-industrial-800 text-white border border-industrial-700 rounded-full flex items-center justify-center hover:bg-industrial-700 hover:scale-110 transition-all shadow-lg"
                title={t('product.notifyMe')}
              >
                <Bell size={20} className="text-industrial-orange" />
              </button>
            ) : (
              <button 
                onClick={handleAddToCart}
                className="w-12 h-12 bg-industrial-orange text-white rounded-full flex items-center justify-center hover:bg-orange-600 hover:scale-110 transition-all shadow-lg"
                title={t('product.addToCart')}
              >
                <ShoppingCart size={20} />
              </button>
            )}
            <div 
              className="w-12 h-12 bg-white text-industrial-900 rounded-full flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all shadow-lg"
              title={t('product.viewDetails')}
            >
              <Eye size={20} />
            </div>
          </div>

          {/* Wishlist button */}
          <button 
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-industrial-900/80 backdrop-blur-sm border border-industrial-700 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500/50 z-20 transition-colors"
          >
            <Heart size={16} />
          </button>
        </div>

        <div className="p-5 flex flex-col h-[200px]">
          <div className="text-xs text-industrial-orange font-bold uppercase mb-2 tracking-wider">{product.type} - {product.size}</div>
          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-industrial-orange transition-colors">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{product.description}</p>
          
          <div className="flex justify-between items-end border-t border-industrial-700/50 pt-4 mt-auto">
            <div>
              <div className="text-xs text-gray-500 mb-1">{t('product.price')}</div>
              <span className="text-2xl font-bold text-white">₹{product.price.toFixed(2)}</span>
            </div>
            {!isOutOfStock ? (
              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">{t('product.inStock')}</span>
            ) : (
              <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">{t('product.outOfStock')}</span>
            )}
          </div>
        </div>
      </Link>
      
      <RestockModal 
        isOpen={isRestockModalOpen} 
        onClose={() => setIsRestockModalOpen(false)} 
        product={product} 
      />
    </>
  );
}
