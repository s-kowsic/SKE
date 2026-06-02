import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import api from '../services/api';
import { Search, Loader2, Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export default function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { t } = useLanguage();
  
  // Mobile Filter state
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    categories: [],
    inStockOnly: false,
    priceRange: [0, 5000], // Example range
  });

  // Sort state
  const [sortBy, setSortBy] = useState('newest');

  // Categories available (could be derived from data)
  const categoriesList = ['Flanges', 'Connectors', 'Machined Parts', 'Valves'];

  useEffect(() => {
    fetchProducts();
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [allProducts, filters, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/products');
      setAllProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let result = [...allProducts];

    // Filter by category
    if (filters.categories.length > 0) {
      // Use partial match or exact match depending on how data is structured
      result = result.filter(p => 
        filters.categories.some(cat => p.type.toLowerCase().includes(cat.toLowerCase())) ||
        filters.categories.includes(p.type)
      );
    }

    // Filter by stock
    if (filters.inStockOnly) {
      result = result.filter(p => p.stockQuantity > 0);
    }

    // Filter by price (assuming simple max price slider for now)
    result = result.filter(p => p.price <= filters.priceRange[1]);

    // Sort
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      // Assuming averageRating or numReviews indicates popularity
      result.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
    }

    setFilteredProducts(result);
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(category);
      if (isSelected) {
        return { ...prev, categories: prev.categories.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...prev.categories, category] };
      }
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) {
      fetchProducts();
      return;
    }
    
    try {
      setIsSearching(true);
      const { data } = await api.post('/ai/search', { query });
      // We set allProducts to the AI results, then filters will apply to them
      setAllProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce AI search slightly
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 2) {
        // Trigger background search if they stop typing
        const form = document.getElementById('searchForm');
        if(form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      } else if (query.length === 0 && !loading) {
        fetchProducts();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen bg-industrial-900 pb-20">
      
      {/* HEADER SECTION */}
      <div className="bg-industrial-800 border-b border-industrial-700 pb-8 mb-8">
        <div className="container mx-auto px-12 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center text-sm text-gray-400">
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{t('products.title')}</h1>
              <p className="text-gray-400 max-w-xl">{t('products.subtitle')}</p>
            </div>
            
            {/* AI Search Bar */}
            <form id="searchForm" onSubmit={handleSearch} className="w-full lg:w-[400px] relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder={t('products.search')} 
                className="w-full pl-12 pr-12 py-4 bg-industrial-900 border border-industrial-700 rounded-xl text-white placeholder-gray-500 focus:border-industrial-orange focus:ring-1 focus:ring-industrial-orange transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {isSearching && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Loader2 className="w-5 h-5 text-industrial-orange animate-spin" />
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* MOBILE FILTER BUTTON */}
          <div className="lg:hidden flex justify-between items-center bg-industrial-800 p-4 rounded-xl border border-industrial-700">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 text-white font-bold"
            >
              <Filter size={20} />
              Filters
            </button>
            <div className="text-sm text-gray-400">{filteredProducts.length} Results</div>
          </div>

          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-industrial-800 p-6 rounded-2xl border border-industrial-700 shadow-xl">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-industrial-700">
                <SlidersHorizontal size={20} className="text-industrial-orange" />
                <h2 className="text-lg font-bold text-white">Filters</h2>
              </div>
              
              {/* Category Filter */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Category</h3>
                <div className="space-y-3">
                  {categoriesList.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center w-5 h-5 rounded border border-industrial-600 bg-industrial-900 group-hover:border-industrial-orange transition-colors">
                        <input 
                          type="checkbox" 
                          className="opacity-0 absolute inset-0 cursor-pointer"
                          checked={filters.categories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                        />
                        {filters.categories.includes(cat) && <div className="w-3 h-3 bg-industrial-orange rounded-sm"></div>}
                      </div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Max Price: ₹{filters.priceRange[1]}</h3>
                <input 
                  type="range" 
                  min="0" max="5000" step="50"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                  className="w-full accent-industrial-orange bg-industrial-900 rounded-lg appearance-none h-2 cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>₹0</span>
                  <span>₹5,000+</span>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5 rounded border border-industrial-600 bg-industrial-900 group-hover:border-industrial-orange transition-colors">
                    <input 
                      type="checkbox" 
                      className="opacity-0 absolute inset-0 cursor-pointer"
                      checked={filters.inStockOnly}
                      onChange={(e) => setFilters({...filters, inStockOnly: e.target.checked})}
                    />
                    {filters.inStockOnly && <div className="w-3 h-3 bg-industrial-orange rounded-sm"></div>}
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">In Stock Only</span>
                </label>
              </div>

            </div>
          </div>

          {/* PRODUCT GRID SECTION */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="hidden lg:flex justify-between items-center mb-6 bg-industrial-800 p-4 rounded-xl border border-industrial-700">
              <div className="text-gray-400">
                {t('products.showing')} <span className="text-white font-bold">{filteredProducts.length}</span> {t('products.results')}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">{t('products.sort')}:</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-industrial-900 border border-industrial-700 text-white py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:border-industrial-orange cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">{t('products.sort.newest')}</option>
                    <option value="popular">{t('products.sort.rating')}</option>
                    <option value="price_asc">{t('products.sort.priceLow')}</option>
                    <option value="price_desc">{t('products.sort.priceHigh')}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            {/* Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-industrial-orange" size={48} />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-industrial-800 rounded-2xl border border-industrial-700 p-12 text-center">
                <div className="w-20 h-20 bg-industrial-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-500">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('products.noResults')}</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any products matching your current filters and search query.</p>
                <button 
                  onClick={() => {
                    setQuery('');
                    setFilters({categories: [], inStockOnly: false, priceRange: [0, 5000]});
                  }} 
                  className="btn-primary py-2 px-6"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween' }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-industrial-900 z-50 border-r border-industrial-700 flex flex-col lg:hidden"
            >
              <div className="p-4 border-b border-industrial-700 flex justify-between items-center bg-industrial-800">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Filter size={20} /> Filters
                </h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-white p-2">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                {/* Sort (Mobile) */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Sort By</h3>
                  <select 
                    className="w-full bg-industrial-800 border border-industrial-700 text-white py-3 px-4 rounded-lg focus:outline-none focus:border-industrial-orange"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="popular">Most Popular</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>

                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Category</h3>
                  <div className="space-y-4">
                    {categoriesList.map(cat => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer">
                        <div className="relative flex items-center justify-center w-6 h-6 rounded border border-industrial-600 bg-industrial-800">
                          <input 
                            type="checkbox" 
                            className="opacity-0 absolute inset-0 cursor-pointer"
                            checked={filters.categories.includes(cat)}
                            onChange={() => handleCategoryChange(cat)}
                          />
                          {filters.categories.includes(cat) && <div className="w-3.5 h-3.5 bg-industrial-orange rounded-sm"></div>}
                        </div>
                        <span className="text-gray-300 text-lg">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Price */}
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Max Price: ₹{filters.priceRange[1]}</h3>
                  <input 
                    type="range" min="0" max="5000" step="50"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({...filters, priceRange: [0, parseInt(e.target.value)]})}
                    className="w-full accent-industrial-orange bg-industrial-800 rounded-lg appearance-none h-2"
                  />
                </div>

                {/* Mobile Stock */}
                <div className="mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative flex items-center justify-center w-6 h-6 rounded border border-industrial-600 bg-industrial-800">
                      <input 
                        type="checkbox" 
                        className="opacity-0 absolute inset-0 cursor-pointer"
                        checked={filters.inStockOnly}
                        onChange={(e) => setFilters({...filters, inStockOnly: e.target.checked})}
                      />
                      {filters.inStockOnly && <div className="w-3.5 h-3.5 bg-industrial-orange rounded-sm"></div>}
                    </div>
                    <span className="text-gray-300 text-lg">In Stock Only</span>
                  </label>
                </div>
              </div>
              
              <div className="p-4 border-t border-industrial-700 bg-industrial-800">
                <button 
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full btn-primary py-4 text-lg font-bold"
                >
                  View {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
