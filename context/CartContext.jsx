// context/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// ===== CREAR EL CONTEXTO =====
const CartContext = createContext();

// ===== HOOK PARA USAR EL CONTEXTO =====
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// ===== PROVIDER DEL CARRITO =====
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // ===== CARGAR CARRITO DESDE LOCALSTORAGE =====
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error cargando carrito:', e);
      }
    }
  }, []);

  // ===== GUARDAR CARRITO EN LOCALSTORAGE =====
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ===== AGREGAR PRODUCTO AL CARRITO =====
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ===== ELIMINAR PRODUCTO DEL CARRITO =====
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  // ===== ACTUALIZAR CANTIDAD =====
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // ===== LIMPIAR CARRITO =====
  const clearCart = () => {
    setCart([]);
  };

  // ===== OBTENER TOTAL DE PRODUCTOS =====
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  };

  // ===== OBTENER PRECIO TOTAL =====
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  };

  // ===== VALORES A COMPARTIR =====
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};