import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import CartSidebar from '../components/CartSidebar';
import ChatbotWidget from '../components/ChatbotWidget';
import Footer from '../components/Footer';
import { useState } from 'react';

export default function VisitorLayout() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleCart={toggleCart} />
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55]"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <main className="flex-grow">
        <Outlet />
      </main>

      <ChatbotWidget />
      <Footer />
    </div>
  );
}
