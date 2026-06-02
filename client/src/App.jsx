import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import VisitorLayout from './layouts/VisitorLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import CustomerDashboard from './pages/CustomerDashboard';
import Cart from './pages/Cart';
import Placeholder from './pages/Placeholder';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminInsights from './pages/AdminInsights';
import AdminUsers from './pages/AdminUsers';
import CustomerOrders from './pages/CustomerOrders';
import Wishlist from './pages/Wishlist';

// Route Guards
const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roleRequired && user.role !== roleRequired) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
        <CartProvider>
          <Toaster position="top-center" toastOptions={{
            style: {
              background: '#1F2937',
              color: '#fff',
              border: '1px solid #374151',
            }
          }}/>
          
          <Routes>
            {/* Public Visitor Routes */}
            <Route element={<VisitorLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Dashboard Routes (Logged in users) */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              {/* Shared Protected */}
              <Route path="/u/:userid/profile" element={<Profile />} />

              {/* Customer Routes */}
              <Route path="/u/:userid/home" element={<CustomerDashboard />} />
              <Route path="/u/:userid/cart" element={<Cart />} />
              <Route path="/u/:userid/orders" element={<CustomerOrders />} />
              <Route path="/u/:userid/wishlist" element={<Wishlist />} />

              {/* Admin Routes */}
              <Route path="/u/:userid/products" element={
                <ProtectedRoute roleRequired="Admin"><AdminProducts /></ProtectedRoute>
              } />
              <Route path="/u/:userid/orders" element={
                <ProtectedRoute roleRequired="Admin"><AdminOrders /></ProtectedRoute>
              } />
              <Route path="/u/:userid/users" element={
                <ProtectedRoute roleRequired="Admin"><AdminUsers /></ProtectedRoute>
              } />
              <Route path="/u/:userid/analytics" element={
                <ProtectedRoute roleRequired="Admin"><AdminAnalytics /></ProtectedRoute>
              } />
              <Route path="/u/:userid/ai-insights" element={
                <ProtectedRoute roleRequired="Admin"><AdminInsights /></ProtectedRoute>
              } />
            </Route>
          </Routes>
        </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
