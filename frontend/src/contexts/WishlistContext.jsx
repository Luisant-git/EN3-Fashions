import React, { createContext, useState, useEffect, useContext } from 'react';
import { addToWishlist, removeFromWishlist, getWishlist } from '../api/wishlistApi';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loadingProductId, setLoadingProductId] = useState(null);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        if (token) {
            getWishlist(token)
                .then(data => {
                    setWishlist(Array.isArray(data) ? data : []);
                    processPendingWishlistItem();
                })
                .catch(err => {
                    console.error(err);
                    setWishlist([]);
                });
        } else {
            setWishlist([]);
        }
    }, [token]);

    const processPendingWishlistItem = async () => {
        const pendingItem = localStorage.getItem('pendingWishlistItem');
        if (pendingItem) {
            try {
                const productId = JSON.parse(pendingItem);
                localStorage.removeItem('pendingWishlistItem');
                await addToWishlist(productId, token);
                const data = await getWishlist(token);
                setWishlist(Array.isArray(data) ? data : []);
                toast.success('Item added to wishlist!');
            } catch (error) {
                console.error('Error adding pending wishlist item:', error);
            }
        }
    };

    const toggleWishlist = async (product) => {
        if (!token) {
            localStorage.setItem('pendingWishlistItem', JSON.stringify(product.id));
            toast.error('Please login to add items to wishlist');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
            return;
        }
        
        setLoadingProductId(product.id);
        const exists = Array.isArray(wishlist) && wishlist.some(item => item.id === product.id);
        
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

    const isInWishlist = (productId) => Array.isArray(wishlist) && wishlist.some(item => item.id === productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loadingProductId }}>
            {children}
        </WishlistContext.Provider>
    );
};