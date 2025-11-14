import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProductById } from '../api/productApi';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import LoadingSpinner from './LoadingSpinner';
import '../styles/BundleOffers.css';

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
    const [bundleSelections, setBundleSelections] = useState([]);
    const [bundlePrice, setBundlePrice] = useState(null);

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

    const handleBundleSelection = (colorName, size) => {
        if (!size) return;
        
        const color = product.colors.find(c => c.name === colorName);
        const sizeInfo = color.sizes.find(s => s.size === size);
        
        const newSelections = [...bundleSelections, { 
            color: colorName, 
            size, 
            price: sizeInfo.price,
            id: Date.now() + Math.random()
        }];
        
        setBundleSelections(newSelections);
        
        // Calculate bundle price
        if (newSelections.length >= 2 && product.bundleOffers) {
            const bundleOffer = product.bundleOffers.find(offer => offer.colorCount === newSelections.length);
            setBundlePrice(bundleOffer ? bundleOffer.price : null);
        } else {
            setBundlePrice(null);
        }
    };

    const removeBundleItem = (itemId) => {
        const newSelections = bundleSelections.filter(item => item.id !== itemId);
        setBundleSelections(newSelections);
        
        if (newSelections.length >= 2 && product.bundleOffers) {
            const bundleOffer = product.bundleOffers.find(offer => offer.colorCount === newSelections.length);
            setBundlePrice(bundleOffer ? bundleOffer.price : null);
        } else {
            setBundlePrice(null);
        }
    };

    const handleBundleAddToCart = () => {
        if (bundleSelections.length < 2 || !bundlePrice) return;
        
        const bundleItem = {
            id: `bundle-${product.id}-${Date.now()}`,
            name: `${product.name} Bundle (${bundleSelections.length} items)`,
            price: bundlePrice,
            imageUrl: product.gallery?.[0]?.url || product.colors[0]?.image,
            type: 'bundle',
            items: bundleSelections.map(sel => {
                const color = product.colors.find(c => c.name === sel.color);
                return {
                    color: sel.color,
                    size: sel.size,
                    originalPrice: sel.price,
                    colorImage: color?.image || product.colors[0]?.image
                };
            })
        };
        
        // Add using CartContext
        addToCart(bundleItem);
        
        // Reset bundle selections
        setBundleSelections([]);
        setBundlePrice(null);
        
        toast.success('Bundle added to cart!');
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
                
                {product.bundleOffers && product.bundleOffers.length > 0 && (
                    <div className="bundle-promo-card">
                        <h3>Bundle Offer!</h3>
                        <p>Pick any {product.bundleOffers[0]?.colorCount} products for special pricing:</p>
                        
                        <div className="bundle-selection">
                            {product.colors.map(color => (
                                <div key={color.name} className="color-bundle-item">
                                    <div className="color-info">
                                        <div 
                                            className="color-circle"
                                            style={{ backgroundColor: color.code }}
                                        ></div>
                                        <span className="color-name">{color.name}</span>
                                    </div>
                                    <select 
                                        className="size-dropdown"
                                        value=""
                                        onChange={(e) => handleBundleSelection(color.name, e.target.value)}
                                    >
                                        <option value="">Choose a size</option>
                                        {color.sizes.map(size => (
                                            <option key={size.size} value={size.size}>
                                                {size.size} - ₹{size.price}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        {bundleSelections.length > 0 && (
                            <div className="bundle-summary">
                                <div className="bundle-details">
                                    <h4>{bundleSelections.length} Items Selected</h4>
                                    <div className="selected-items">
                                        {bundleSelections.map((item) => (
                                            <span key={item.id} className="bundle-item">
                                                {item.color} ({item.size})
                                                <button 
                                                    className="remove-bundle-item"
                                                    onClick={() => removeBundleItem(item.id)}
                                                >×</button>
                                            </span>
                                        ))}
                                    </div>
                                    {bundleSelections.length >= 2 && (
                                        bundlePrice ? (
                                            <>
                                                <div className="bundle-pricing">
                                                    <span className="bundle-total">Bundle Price: ₹{bundlePrice}</span>
                                                    <span className="savings">You save ₹{bundleSelections.reduce((sum, item) => sum + parseInt(item.price), 0) - parseInt(bundlePrice)}</span>
                                                </div>
                                                <button 
                                                    className="bundle-add-btn"
                                                    onClick={handleBundleAddToCart}
                                                >
                                                    Add Bundle to Cart
                                                </button>
                                            </>
                                        ) : (
                                            <div className="bundle-no-offer-message">
                                                ⚠️ No bundle offer available for {bundleSelections.length} items. Check available offers below.
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        )}
                        
                        <div className="bundle-offers-list">
                            {product.bundleOffers.map(offer => (
                                <p key={offer.colorCount}>
                                    Pick any {offer.colorCount} product{offer.colorCount > 1 ? 's' : ''} for <strong>₹{offer.price}</strong>
                                </p>
                            ))}
                        </div>
                    </div>
                )}

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