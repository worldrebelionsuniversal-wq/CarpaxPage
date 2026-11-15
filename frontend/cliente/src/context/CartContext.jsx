import React, { createContext, useContext, useMemo } from 'react';
import { useCart } from '../hooks/useCart';

const CartContext = createContext();

export const useCartContext = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCartContext debe ser usado dentro de CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const cart = useCart();
    const value = useMemo(() => cart, [cart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;