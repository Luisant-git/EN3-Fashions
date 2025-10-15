import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { getBundlePrice } from '../data/mockData';

const CartPage = () => {
    const navigate = useNavigate();
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

    const bundleEligibleItems = cart.filter(item => item.price === 499);
    const nonBundleItems = cart.filter(item => item.price !== 499);

    const bundleQty = bundleEligibleItems.reduce((sum, item) => sum + item.quantity, 0);
    const bundleTotal = getBundlePrice(bundleQty);
    const bundleOriginalTotal = bundleQty * 499;

    const nonBundleTotal = nonBundleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const subtotal = bundleTotal + nonBundleTotal;
    const totalSavings = bundleOriginalTotal - bundleTotal;

    const [deliveryOption, setDeliveryOption] = useState({ fee: 50, name: 'Standard Delivery' });
    const deliveryOptions = [
        { fee: 50, name: 'Standard Delivery', duration: '3-5 days' },
        { fee: 150, name: 'Express Delivery', duration: '1-2 days' },
        { fee: 250, name: 'Next Day Delivery', duration: 'Tomorrow' },
    ];
    const finalTotal = subtotal + deliveryOption.fee;
    
    if (cart.length === 0) {
        return <div className="cart-page empty-cart"><h2>Your Cart is Empty</h2><button onClick={() => navigate('/')}>Continue Shopping</button></div>;
    }

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <div className="cart-content">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
                            <img src={item.imageUrl} alt={item.name} />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>Size: {item.size}, Color: {item.color}</p>
                                <p>Price: ₹{item.price}</p>
                                <div className="quantity-control">
                                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                            <button className="remove-item" onClick={() => removeFromCart(item.id, item.size, item.color)}>Remove</button>
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