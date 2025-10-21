import React, { createContext, useState, useEffect, useContext } from 'react';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlistApi';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loadingProductId, setLoadingProductId] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            getWishlist(token)
                .then(setWishlist)
                .catch(console.error);
        } else {
            setWishlist([]);
        }
    }, [token]);

    const toggleWishlist = async (product) => {
        if (!token) return;
        
        setLoadingProductId(product.id);
        const exists = wishlist.some(item => item.id === product.id);
        
        try {
            if (exists) {
                await removeFromWishlist(product.id, token);
                setWishlist(prev => prev.filter(item => item.id !== product.id));
            } else {
                await addToWishlist(product.id, token);
                setWishlist(prev => [...prev, product]);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        } finally {
            setLoadingProductId(null);
        }
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loadingProductId }}>
            {children}
        </WishlistContext.Provider>
    );
};