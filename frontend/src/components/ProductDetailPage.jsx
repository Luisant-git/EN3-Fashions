import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../api/productApi';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import LoadingSpinner from './LoadingSpinner';

const ProductDetailPage = () => {
    const { productId } = useParams();
    const { addToCart, loading: cartLoading } = useContext(CartContext);
    const { toggleWishlist, isInWishlist, loadingProductId: wishlistLoadingId } = useContext(WishlistContext);
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [activeImage, setActiveImage] = useState(null);
    const [openAccordion, setOpenAccordion] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(productId);
                setProduct(data);
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0]);
                    setActiveImage(data.colors[0].image);
                    if (data.colors[0].sizes && data.colors[0].sizes.length > 0) {
                        setSelectedSize(data.colors[0].sizes[0]);
                    }
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);
    
    if (loading) return <div className="loading-container"><LoadingSpinner /></div>;
    if (!product) return <div>Product not found!</div>;

    const images = product.colors?.map(c => c.image) || [];

    const handleAddToCart = () => {
        if (cartLoading || !selectedSize) return;
        addToCart({
            id: product.id,
            name: product.name,
            price: selectedSize.price,
            imageUrl: selectedColor.image,
            size: selectedSize.size,
            color: selectedColor.name
        });
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
                        {product.colors.map((color, index) => (
                            <div 
                                key={index} 
                                className={`pdp-thumbnail ${color.image === activeImage ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveImage(color.image);
                                    setSelectedColor(color);
                                    if (color.sizes.length > 0) {
                                        setSelectedSize(color.sizes[0]);
                                    }
                                }}
                            >
                                <img src={color.image} alt={`${product.name} ${color.name}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="pdp-details-section">
                <h1>{product.name}</h1>
                <p className="pdp-price">₹{selectedSize?.price || product.basePrice}</p>
                <p className="pdp-description">{product.description}</p>

                <div className="pdp-selector-group">
                    <label className="pdp-selector-label">Color: <strong>{selectedColor?.name}</strong></label>
                    <div className="pdp-color-options">
                        {product.colors.map(color => (
                            <button 
                                key={color.name}
                                className={`pdp-color-btn ${selectedColor?.name === color.name ? 'active' : ''}`}
                                style={{ backgroundColor: color.code }}
                                onClick={() => {
                                    setSelectedColor(color);
                                    setActiveImage(color.image);
                                    if (color.sizes.length > 0) {
                                        setSelectedSize(color.sizes[0]);
                                    }
                                }}
                                aria-label={`Select color ${color.name}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="pdp-selector-group">
                    <label className="pdp-selector-label">Size:</label>
                    <div className="pdp-size-options">
                        {selectedColor?.sizes.map(size => (
                            <button 
                                key={size.size}
                                className={`pdp-size-btn ${selectedSize?.size === size.size ? 'active' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size.size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pdp-actions">
                    <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={cartLoading || !selectedSize}>
                        {cartLoading ? <LoadingSpinner /> : 'Add to Cart'}
                    </button>
                    <button 
                        className={`wishlist-action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist({
                            id: product.id,
                            name: product.name,
                            price: selectedSize?.price || product.basePrice,
                            imageUrl: selectedColor?.image
                        })}
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