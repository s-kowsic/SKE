import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Loader2 } from 'lucide-react';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await api.get('/users/wishlist');
        setWishlist(data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-industrial-orange" size={48} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={32} className="text-industrial-orange" />
        <h1 className="text-3xl font-bold text-white">{t('wishlist.title')}</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-industrial-800 p-12 rounded-2xl border border-industrial-700 text-center shadow-xl">
          <Heart size={64} className="mx-auto text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">{t('wishlist.empty')}</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            {t('wishlist.emptyDesc')}
          </p>
          <Link to="/products" className="btn-primary inline-flex">
            {t('wishlist.explore')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
