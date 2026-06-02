import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { User as UserIcon, ShoppingCart, Menu, X, Globe } from 'lucide-react';

export default function Navbar({ toggleCart }) {
  const { user } = useAuth();
  const { cart } = useCart();
  const { language, toggleLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-industrial-900/95 backdrop-blur-md shadow-lg border-b border-industrial-700' : 'bg-industrial-900 border-b border-industrial-700'} p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Left: Logo */}
        <div className="flex-1">
          <Link to="/" className="text-2xl font-bold text-industrial-orange tracking-wider">
            SRI KRISHNA <span className="text-white">ENG.</span>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="hidden md:flex flex-1 justify-center space-x-8">
          <Link to="/" className="hover:text-industrial-orange transition-colors font-semibold">{t('nav.home')}</Link>
          <Link to="/products" className="hover:text-industrial-orange transition-colors font-semibold">{t('nav.products')}</Link>
          <Link to="/about" className="hover:text-industrial-orange transition-colors font-semibold">{t('nav.about')}</Link>
          <Link to="/contact" className="hover:text-industrial-orange transition-colors font-semibold">{t('nav.contact')}</Link>
        </div>

        {/* Right: Lang Toggle + Auth / Profile (Desktop) */}
        <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-industrial-700 bg-industrial-800 hover:border-industrial-orange/50 transition-all text-sm font-bold"
            title="Switch Language"
          >
            <span className={language === 'en' ? 'text-industrial-orange' : 'text-gray-400'}>EN</span>
            <span className="text-gray-600">|</span>
            <span className={language === 'ta' ? 'text-industrial-orange' : 'text-gray-400'}>தமிழ்</span>
          </button>

          {toggleCart && (
            <button onClick={toggleCart} className="relative text-gray-300 hover:text-industrial-orange transition-colors">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-industrial-orange text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}

          {user ? (
            <Link to={user.role === 'Admin' ? `/u/${user.userid}/products` : `/u/${user.userid}/home`} className="hover:text-industrial-orange flex items-center space-x-2 font-bold bg-industrial-800 px-4 py-2 rounded-full border border-industrial-700 transition-colors">
              <UserIcon size={20} className="text-industrial-orange" />
              <span>{user.name}</span>
            </Link>
          ) : (
            <div className="space-x-4 font-semibold">
              <Link to="/login" className="hover:text-industrial-orange transition-colors">{t('nav.login')}</Link>
              <Link to="/register" className="bg-industrial-orange text-white px-5 py-2 rounded shadow-lg shadow-industrial-orange/20 hover:shadow-industrial-orange/40 hover:-translate-y-0.5 transition-all">{t('nav.register')}</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          {/* Mobile Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2 py-1 rounded-full border border-industrial-700 bg-industrial-800 text-xs font-bold"
          >
            <Globe size={14} className="text-industrial-orange" />
            <span className={language === 'en' ? 'text-industrial-orange' : 'text-gray-400'}>EN</span>
            <span className="text-gray-600">|</span>
            <span className={language === 'ta' ? 'text-industrial-orange' : 'text-gray-400'}>தமிழ்</span>
          </button>

          {toggleCart && (
            <button onClick={toggleCart} className="relative text-gray-300 hover:text-industrial-orange transition-colors">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-industrial-orange text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                  {cartItemCount}
                </span>
              )}
            </button>
          )}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-industrial-900 border-b border-industrial-700 shadow-2xl py-4 px-6 flex flex-col space-y-4 animate-fade-in origin-top">
          <Link to="/" className="text-lg font-semibold hover:text-industrial-orange transition-colors">{t('nav.home')}</Link>
          <Link to="/products" className="text-lg font-semibold hover:text-industrial-orange transition-colors">{t('nav.products')}</Link>
          <Link to="/about" className="text-lg font-semibold hover:text-industrial-orange transition-colors">{t('nav.about')}</Link>
          <Link to="/contact" className="text-lg font-semibold hover:text-industrial-orange transition-colors">{t('nav.contact')}</Link>
          
          <div className="border-t border-industrial-700 pt-4 mt-2 flex flex-col space-y-4">
            {user ? (
              <Link to={user.role === 'Admin' ? `/u/${user.userid}/products` : `/u/${user.userid}/home`} className="flex items-center space-x-2 font-bold text-industrial-orange">
                <UserIcon size={20} />
                <span>{t('nav.myAccount')} ({user.name})</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-lg font-semibold hover:text-industrial-orange transition-colors">{t('nav.login')}</Link>
                <Link to="/register" className="btn-primary text-center">{t('nav.register')}</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
