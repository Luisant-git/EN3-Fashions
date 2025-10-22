import React, { useState, useContext } from 'react';
import { WishlistContext } from '../contexts/WishlistContext';
import LoadingSpinner from './LoadingSpinner';

const ProductCard = ({ product, navigate }) => {
    const [hover, setHover] = useState(false);
    const { toggleWishlist, isInWishlist, loadingProductId } = useContext(WishlistContext);
    
    return (
        <div className="product-card">
            <div className="product-image-container" 
                 onMouseEnter={() => setHover(true)} 
                 onMouseLeave={() => setHover(false)}
                 onClick={() => navigate(`/product/${product.id}`)}>
                <img src={hover && product.altImageUrl ? product.altImageUrl : product.imageUrl} alt={product.name} />
                <div className="bundle-tag">Bundle Available</div>
                 <button 
                    className={`wishlist-toggle ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        toggleWishlist({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            imageUrl: product.imageUrl
                        }); 
                    }}
                    disabled={loadingProductId === product.id}
                    >
                    {loadingProductId === product.id ? <LoadingSpinner /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>}
                </button>
            </div>
            <div className="product-info" onClick={() => navigate(`/product/${product.id}`)}>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
            </div>
        </div>
    );
};

export default ProductCard;