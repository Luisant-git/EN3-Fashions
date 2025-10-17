import React, { createContext, useState, useEffect, useContext } from 'react';
import { addToCart as addToCartAPI, getCart, removeFromCart as removeFromCartAPI, updateCartQuantity } from '../api/cartApi';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const CartContext = createContext(null);

const CartProviderInner = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user, token } = useContext(AuthContext);

    // Load cart from API when user is logged in
    useEffect(() => {
        if (user && token) {
            fetchCart();
        } else {
            setCart([]);
        }
    }, [user, token]);

    const fetchCart = async () => {
        try {
            const cartData = await getCart();
            setCart(cartData);
        } catch (error) {
            console.error('Error fetching cart:', error);
        }
    };

    const addToCart = async (product) => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }
        
        setLoading(true);
        try {
            await addToCartAPI(product);
            await fetchCart();
            toast.success('Item added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add item to cart');
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await removeFromCartAPI(itemId);
            await fetchCart();
            toast.success('Item removed from cart');
        } catch (error) {
            console.error('Error removing from cart:', error);
            toast.error('Failed to remove item');
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            try {
                await updateCartQuantity(itemId, newQuantity);
                await fetchCart();
            } catch (error) {
                console.error('Error updating quantity:', error);
                toast.error('Failed to update quantity');
            }
        }
    };

    const clearCart = async () => {
        try {
            // Clear cart on backend if needed
            setCart([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const CartProvider = ({ children }) => {
    return (
        <CartProviderInner>
            {children}
        </CartProviderInner>
    );
};