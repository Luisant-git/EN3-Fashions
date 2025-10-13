import React, { useContext } from 'react';
import { WishlistContext } from '../contexts/WishlistContext';
import ProductCard from './ProductCard';

const WishlistPage = ({ setView }) => {
    const { wishlist } = useContext(WishlistContext);

    if (wishlist.length === 0) {
        return <div className="wishlist-page empty-wishlist"><h2>Your Wishlist is Empty</h2><p>Add items you love to your wishlist to save them for later.</p><button onClick={() => setView({ page: 'home' })}>Discover Products</button></div>;
    }

    return (
        <div className="wishlist-page">
            <h1>My Wishlist</h1>
            <div className="product-grid">
                {wishlist.map(product => <ProductCard key={product.id} product={product} setView={setView} />)}
            </div>
        </div>
    );
};

export default WishlistPage;