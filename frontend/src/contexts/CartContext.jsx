import React, { createContext, useState } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const addToCart = (product, size, color) => {
        setLoading(true);
        setTimeout(() => {
            setCart(prevCart => {
                const existing = prevCart.find(item => item.id === product.id && item.size === size && item.color === color);
                if (existing) {
                    return prevCart.map(item => item.id === product.id && item.size === size && item.color === color ? { ...item, quantity: item.quantity + 1 } : item);
                }
                return [...prevCart, { ...product, quantity: 1, size, color }];
            });
            setLoading(false);
        }, 500);
    };

    const removeFromCart = (productId, size, color) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.size === size && item.color === color)));
    };

    const updateQuantity = (productId, size, color, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, size, color);
        } else {
            setCart(prevCart => prevCart.map(item => item.id === productId && item.size === size && item.color === color ? { ...item, quantity: newQuantity } : item));
        }
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};