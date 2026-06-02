import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    // Only toast once per action
    toast.success(`${product.name} added to cart`);
    
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        // Clamp to stockQuantity
        const maxQuantity = product.stockQuantity || 999;
        const newQuantity = Math.min(existing.quantity + quantity, maxQuantity);
        
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: newQuantity } : item
        );
      }
      
      const maxQuantity = product.stockQuantity || 999;
      const newQuantity = Math.min(quantity, maxQuantity);
      return [...prev, { ...product, quantity: newQuantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prev) =>
      prev.map((item) => {
        if (item._id === productId) {
          const maxQuantity = item.stockQuantity || 999;
          const clampedQuantity = Math.min(newQuantity, maxQuantity);
          return { ...item, quantity: clampedQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
