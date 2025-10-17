import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { getBundlePrice } from '../data/mockData';
import '../styles/CartPage.css';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
    const [deliveryOption, setDeliveryOption] = useState({ fee: 50, name: 'Standard Delivery' });

    if (!cart || cart.length === 0) {
        return <div className="cart-page empty-cart"><h2>Your Cart is Empty</h2><button onClick={() => navigate('/')}>Continue Shopping</button></div>;
    }

    const bundleItems = cart.filter(item => item.type === 'bundle');
    const regularItems = cart.filter(item => item.type !== 'bundle');

    const bundleTotal = bundleItems.reduce((sum, item) => sum + parseInt(item.price), 0);
    const regularTotal = regularItems.reduce((sum, item) => sum + (parseInt(item.price) * (item.quantity || 1)), 0);
    
    const subtotal = bundleTotal + regularTotal;
    const totalSavings = 0; // Calculate savings if needed
    const deliveryOptions = [
        { fee: 50, name: 'Standard Delivery', duration: '3-5 days' },
        { fee: 150, name: 'Express Delivery', duration: '1-2 days' },
        { fee: 250, name: 'Next Day Delivery', duration: 'Tomorrow' },
    ];
    const finalTotal = subtotal + deliveryOption.fee;
    
    if (false) {
        return <div className="cart-page empty-cart"><h2>Your Cart is Empty</h2><button onClick={() => navigate('/')}>Continue Shopping</button></div>;
    }

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <div className="cart-content">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={item.id} className="cart-item-card">
                            <div className="item-image-section">
                                {item.type === 'bundle' ? (
                                    <div className="bundle-images-grid">
                                        {item.bundleItems?.map((bundleItem, idx) => (
                                            <div key={idx} className="bundle-color-item">
                                                <img 
                                                    src={bundleItem.colorImage || item.imageUrl} 
                                                    alt={`${bundleItem.color}`}
                                                    className="color-image"
                                                />
                                                <span className="color-label">{bundleItem.color}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <img src={item.imageUrl} alt={item.name} className="single-item-image" />
                                )}
                            </div>
                            
                            <div className="item-details-section">
                                <div className="item-header">
                                    <h3 className="item-title">{item.name}</h3>
                                    {item.type === 'bundle' && (
                                        <span className="bundle-badge">Bundle</span>
                                    )}
                                </div>
                                
                                {item.type === 'bundle' ? (
                                    <div className="bundle-details">
                                        {item.bundleItems?.map((bundleItem, idx) => (
                                            <div key={idx} className="bundle-item-detail">
                                                <span className="detail-color">{bundleItem.color}</span>
                                                <span className="detail-size">Size: {bundleItem.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="regular-item-details">
                                        <span className="item-color">Color: {item.color}</span>
                                        <span className="item-size">Size: {item.size}</span>
                                    </div>
                                )}
                                
                                <div className="item-price-section">
                                    <span className="current-price">₹{item.price}</span>
                                    {item.type === 'bundle' && item.bundleItems && (
                                        <span className="savings-text">
                                            Save ₹{item.bundleItems.reduce((sum, i) => sum + parseInt(i.originalPrice), 0) - parseInt(item.price)}
                                        </span>
                                    )}
                                </div>
                                
                                {item.type !== 'bundle' && (
                                    <div className="quantity-section">
                                        <label>Quantity:</label>
                                        <div className="quantity-controls">
                                            <button 
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                -
                                            </button>
                                            <span className="qty-display">{item.quantity}</span>
                                            <button 
                                                className="qty-btn"
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <button 
                                className="remove-btn" 
                                onClick={() => removeFromCart(item.id)}
                                title="Remove item"
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {totalSavings > 0 && (
                        <div className="summary-row savings">
                            <span>Bundle Savings</span>
                            <span>- ₹{totalSavings.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="delivery-options">
                        <h3>Delivery Options</h3>
                        {deliveryOptions.map(opt => (
                            <div key={opt.name} className={`delivery-option-card ${deliveryOption.name === opt.name ? 'selected' : ''}`} onClick={() => setDeliveryOption(opt)}>
                                <div>
                                    <strong>{opt.name}</strong> ({opt.duration})
                                </div>
                                <span>₹{opt.fee}</span>
                            </div>
                        ))}
                    </div>
                     <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryOption.fee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => navigate('/checkout', { state: { deliveryOption } })}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;