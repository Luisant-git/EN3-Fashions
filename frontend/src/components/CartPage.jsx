import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { getBundlePrice } from '../data/mockData';

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
    const totalSavings = bundleItems.reduce((sum, item) => {
        if (item.bundleItems) {
            const originalTotal = item.bundleItems.reduce((bundleSum, bundleItem) => 
                bundleSum + parseInt(bundleItem.originalPrice || 0), 0);
            return sum + (originalTotal - parseInt(item.price));
        }
        return sum;
    }, 0);
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
                        <div key={item.id} className="cart-item">
                            {item.type === 'bundle' ? (
                                <div className="bundle-images">
                                    {item.bundleItems?.map((bundleItem, idx) => (
                                        <img 
                                            key={idx}
                                            src={bundleItem.colorImage || item.imageUrl} 
                                            alt={`${bundleItem.color}`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <img src={item.imageUrl} alt={item.name} />
                            )}
                            
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                {item.type === 'bundle' && (
                                    <span className="bundle-tag">Bundle</span>
                                )}
                                
                                {item.type === 'bundle' ? (
                                    <div className="bundle-info">
                                        {item.bundleItems?.map((bundleItem, idx) => (
                                            <div key={idx}>
                                                <span>{bundleItem.color} - Size: {bundleItem.size}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <span>Color: {item.color}</span>
                                        <span>Size: {item.size}</span>
                                    </div>
                                )}
                                
                                <p className="product-price">₹{item.price}</p>
                                {item.type === 'bundle' && item.bundleItems && (
                                    <span className="simple-savings">Save ₹{item.bundleItems.reduce((sum, i) => sum + parseInt(i.originalPrice), 0) - parseInt(item.price)}</span>
                                )}
                                
                                {item.type !== 'bundle' && (
                                    <div className="quantity-control">
                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                )}
                            </div>
                            
                            <button className="remove-item" onClick={() => removeFromCart(item.id)}></button>
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