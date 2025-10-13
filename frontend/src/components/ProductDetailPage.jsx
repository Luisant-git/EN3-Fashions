import React, { useState, useContext } from 'react';
import { PRODUCTS } from '../data/mockData';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import LoadingSpinner from './LoadingSpinner';

const ProductDetailPage = ({ productId, setView }) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const { addToCart, loading: cartLoading } = useContext(CartContext);
    const { toggleWishlist, isInWishlist, loadingProductId: wishlistLoadingId } = useContext(WishlistContext);
    
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
    const [activeImage, setActiveImage] = useState(product?.imageUrl);
    const [openAccordion, setOpenAccordion] = useState(1);
    
    if (!product) return <div>Product not found!</div>;

    const images = product.galleryImages || [product.imageUrl, product.altImageUrl];

    const handleAddToCart = () => {
        if (cartLoading) return;
        addToCart(product, selectedSize, selectedColor);
    };

    const accordionItems = [
        { id: 1, title: 'Product Description', content: 'This is a high-quality garment made from premium materials, designed for comfort and style. Perfect for any occasion, it features a modern fit and durable construction.' },
        { id: 2, title: 'Shipping & Returns', content: 'We offer free standard shipping on all orders over ₹1000. Express shipping options are available at checkout. Returns are accepted within 30 days of purchase for a full refund.' }
    ];

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="product-detail-page">
            <div className="pdp-image-section">
                <div className="pdp-image-gallery">
                    <div className="pdp-main-image">
                        <img src={activeImage} alt={product.name} />
                    </div>
                    <div className="pdp-thumbnails">
                        {images.map((img, index) => (
                            <div 
                                key={index} 
                                className={`pdp-thumbnail ${img === activeImage ? 'active' : ''}`}
                                onClick={() => setActiveImage(img)}
                            >
                                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="pdp-details-section">
                <h1>{product.name}</h1>
                <p className="pdp-price">₹{product.price}</p>

                <div className="pdp-selector-group">
                    <label className="pdp-selector-label">Color: <strong>{selectedColor}</strong></label>
                    <div className="pdp-color-options">
                        {product.colors.map(color => (
                            <button 
                                key={color}
                                className={`pdp-color-btn ${selectedColor === color ? 'active' : ''}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                onClick={() => setSelectedColor(color)}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="pdp-selector-group">
                    <label className="pdp-selector-label">Size:</label>
                    <div className="pdp-size-options">
                        {product.sizes.map(size => (
                            <button 
                                key={size}
                                className={`pdp-size-btn ${selectedSize === size ? 'active' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pdp-actions">
                    <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={cartLoading}>
                        {cartLoading ? <LoadingSpinner /> : 'Add to Cart'}
                    </button>
                    <button 
                        className={`wishlist-action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product)}
                        disabled={wishlistLoadingId === product.id}
                    >
                        {wishlistLoadingId === product.id ? <LoadingSpinner /> : (isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist')}
                    </button>
                </div>
                
                <div className="bundle-promo-card">
                    <h3>Bundle Offer!</h3>
                    <p>Pick any 2 for <strong>₹799</strong></p>
                    <p>Pick any 3 for <strong>₹999</strong></p>
                </div>

                <div className="pdp-accordion">
                    {accordionItems.map(item => (
                        <div key={item.id} className="accordion-item">
                            <button className="accordion-header" onClick={() => toggleAccordion(item.id)}>
                                <span>{item.title}</span>
                                <span className="accordion-icon">{openAccordion === item.id ? '-' : '+'}</span>
                            </button>
                            <div className={`accordion-content ${openAccordion === item.id ? 'open' : ''}`}>
                                <p>{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;