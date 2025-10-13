import React, { createContext, useState } from 'react';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loadingProductId, setLoadingProductId] = useState(null);

    const toggleWishlist = (product) => {
        setLoadingProductId(product.id);
        setTimeout(() => {
            setWishlist(prev => {
                const exists = prev.some(item => item.id === product.id);
                if (exists) {
                    return prev.filter(item => item.id !== product.id);
                }
                return [...prev, product];
            });
            setLoadingProductId(null);
        }, 500);
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loadingProductId }}>
            {children}
        </WishlistContext.Provider>
    );
};