import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Home, Settings, Heart, Globe } from 'lucide-react';
import ChatbotWidget from '../components/ChatbotWidget';

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const encodedUserId = user?.userid ? encodeURIComponent(user.userid) : 'user';

  const adminLinks = [
    { name: t('dashboard.products'), path: `/u/${encodedUserId}/products`, icon: <Package size={20} /> },
    { name: t('dashboard.orders'), path: `/u/${encodedUserId}/orders`, icon: <ShoppingCart size={20} /> },
    { name: t('dashboard.users'), path: `/u/${encodedUserId}/users`, icon: <Users size={20} /> },
    { name: t('dashboard.analytics'), path: `/u/${encodedUserId}/analytics`, icon: <LayoutDashboard size={20} /> },
    { name: t('dashboard.aiInsights'), path: `/u/${encodedUserId}/ai-insights`, icon: <LayoutDashboard size={20} /> },
    { name: t('dashboard.profile'), path: `/u/${encodedUserId}/profile`, icon: <Settings size={20} /> },
  ];

  const customerLinks = [
    { name: t('dashboard.home'), path: `/u/${encodedUserId}/home`, icon: <Home size={20} /> },
    { name: t('dashboard.cart'), path: `/u/${encodedUserId}/cart`, icon: <ShoppingCart size={20} /> },
    { name: t('dashboard.orders'), path: `/u/${encodedUserId}/orders`, icon: <Package size={20} /> },
    { name: t('dashboard.wishlist'), path: `/u/${encodedUserId}/wishlist`, icon: <Heart size={20} /> },
    { name: t('dashboard.profile'), path: `/u/${encodedUserId}/profile`, icon: <Settings size={20} /> },
  ];

  const links = user?.role === 'Admin' ? adminLinks : customerLinks;

  return (
    <div className="flex h-screen bg-industrial-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-industrial-800 border-r border-industrial-700 flex flex-col">
        <div className="p-6 border-b border-industrial-700">
          <Link to="/" className="text-xl font-bold text-industrial-orange tracking-wider">
            SRI KRISHNA <span className="text-white">ENG.</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg text-gray-400 hover:bg-industrial-700 hover:text-white transition-colors">
            <Home size={20} /> {t('nav.backToStore')}
          </Link>
          <div className="my-4 border-t border-industrial-700"></div>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive ? 'bg-industrial-orange text-white font-bold' : 'text-gray-400 hover:bg-industrial-700 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-industrial-700">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 p-3 mb-2 w-full rounded-lg bg-industrial-900 border border-industrial-700 hover:border-industrial-orange/50 transition-all text-sm font-bold"
          >
            <Globe size={18} className="text-industrial-orange" />
            <span className={language === 'en' ? 'text-industrial-orange' : 'text-gray-400'}>EN</span>
            <span className="text-gray-600">|</span>
            <span className={language === 'ta' ? 'text-industrial-orange' : 'text-gray-400'}>தமிழ்</span>
          </button>

          <div className="flex items-center gap-3 p-3 mb-2 rounded-lg bg-industrial-900 border border-industrial-700">
            <div className="w-8 h-8 rounded-full bg-industrial-orange flex items-center justify-center font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden text-sm">
              <p className="font-bold truncate">{user?.name}</p>
              <p className="text-gray-400 text-xs truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-3 p-3 w-full rounded-lg text-red-500 hover:bg-industrial-700 transition-colors">
            <LogOut size={20} /> {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-industrial-900">
        <Outlet />
      </main>

      <ChatbotWidget />
    </div>
  );
}
