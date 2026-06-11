import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, ShieldCheck, Truck, ArrowLeft, Loader2, Star, CheckCircle, Bell } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import RestockModal from '../components/RestockModal';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
    // Scroll to top on load
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      fetchRecommendations(data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async (prod) => {
    try {
      setLoadingRecs(true);
      const { data } = await api.post('/ai/recommendations', { 
        productId: prod._id, 
        productName: prod.name 
      });
      setRecommendations(data);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleAddToCart = () => {
    addToCart({ ...product, quantity: quantity || 1 });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-industrial-900">
        <Loader2 className="animate-spin text-industrial-orange w-12 h-12" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-industrial-900 text-white">
        <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
        <Link to="/products" className="btn-primary px-6 py-2">Return to Catalog</Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="min-h-screen bg-industrial-900 pt-24 pb-20">
      <div className="container mx-auto px-4 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center text-sm text-gray-400 font-medium">
          
        </div>

        {/* Product Overview Section */}
        <div className="bg-industrial-800 rounded-2xl shadow-2xl border border-industrial-700 overflow-hidden mb-16">
          <div className="grid lg:grid-cols-2 gap-0">
            
            {/* Left: Image Gallery */}
            <div className="relative p-8 lg:p-12 bg-gray-800/50 flex items-center justify-center group overflow-hidden">
              {product.imageUrl ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full max-w-md h-auto object-cover rounded-xl shadow-2xl group-hover:scale-110 transition-transform duration-500 origin-center cursor-zoom-in"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-gray-500 bg-industrial-900 rounded-xl">No Image Available</div>
              )}
              {!isOutOfStock && (
                <div className="absolute top-6 left-6 bg-green-500/20 text-green-400 border border-green-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-sm">
                  <CheckCircle size={14} /> {t('product.inStock')} ({product.stockQuantity})
                </div>
              )}
              {isOutOfStock && (
                <div className="absolute top-6 left-6 bg-red-500/20 text-red-400 border border-red-500/50 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 backdrop-blur-sm">
                  {t('product.outOfStock')}
                </div>
              )}
            </div>

            {/* Right: Product Details */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="uppercase tracking-wider text-industrial-orange text-sm font-bold mb-3">{product.type}</div>
              <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-4 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-industrial-orange">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.round(product.averageRating || 5) ? "currentColor" : "none"} className={i >= Math.round(product.averageRating || 5) ? "text-gray-600" : ""} />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">{product.numReviews || 0} Reviews</span>
              </div>

              <div className="text-4xl font-bold text-white mb-8 border-b border-industrial-700 pb-8">
                ₹{product.price.toFixed(2)}
                <span className="text-sm text-gray-400 font-normal ml-2">/ piece</span>
              </div>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Specifications snippet */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-industrial-900 p-4 rounded-xl border border-industrial-700">
                  <span className="block text-gray-500 text-xs uppercase mb-1">Dimensions / Size</span>
                  <span className="font-bold text-white">{product.size}</span>
                </div>
                <div className="bg-industrial-900 p-4 rounded-xl border border-industrial-700">
                  <span className="block text-gray-500 text-xs uppercase mb-1">Material</span>
                  <span className="font-bold text-white">Premium Grade Steel</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                {!isOutOfStock ? (
                  <>
                    <div className="flex items-center bg-industrial-900 rounded-xl border border-industrial-700 p-1">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors">-</button>
                      <input type="number" value={quantity} readOnly className="w-16 bg-transparent text-center text-white font-bold outline-none" />
                      <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white transition-colors">+</button>
                    </div>
                    
                    <button onClick={handleAddToCart} className="flex-1 btn-primary py-4 px-8 flex items-center justify-center gap-3 text-lg group">
                      <ShoppingCart size={22} className="group-hover:-translate-y-1 transition-transform" />
                      {t('product.addToCart')}
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsRestockModalOpen(true)} className="flex-1 bg-industrial-900 text-white border border-industrial-700 hover:border-industrial-orange py-4 px-8 flex items-center justify-center gap-3 text-lg group rounded transition-colors">
                    <Bell size={22} className="text-industrial-orange group-hover:-translate-y-1 transition-transform" />
                    {t('product.notifyMe')}
                  </button>
                )}
                
                <button onClick={handleWishlist} className={`w-16 flex items-center justify-center rounded-xl border transition-colors ${isWishlisted ? 'bg-red-500/10 border-red-500 text-red-500' : 'bg-industrial-900 border-industrial-700 text-gray-400 hover:text-white hover:border-gray-500'}`}>
                  <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "scale-110 transition-transform" : ""} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-industrial-orange" /> 1 Year Warranty</div>
                <div className="flex items-center gap-2"><Truck size={18} className="text-industrial-orange" /> Free Global Shipping</div>
              </div>

            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        <div className="mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{t('product.recommendations')}</h2>
              <p className="text-gray-400">AI-curated recommendations based on this item.</p>
            </div>
            <div className="w-12 h-12 bg-industrial-800 rounded-full flex items-center justify-center text-industrial-orange">
              <Star size={24} />
            </div>
          </div>

          {loadingRecs ? (
            <div className="flex gap-6 overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-full md:w-1/3 lg:w-1/4 h-80 bg-industrial-800 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendations.map(rec => (
                <ProductCard key={rec._id} product={rec} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 bg-industrial-800 rounded-2xl border border-industrial-700">
              No recommendations available at this time.
            </div>
          )}
        </div>

      </div>
      
      {product && (
        <RestockModal 
          isOpen={isRestockModalOpen}
          onClose={() => setIsRestockModalOpen(false)}
          product={product}
        />
      )}
    </div>
  );
}
