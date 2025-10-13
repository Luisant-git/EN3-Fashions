import React, { useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import LoadingSpinner from './LoadingSpinner';

const CheckoutPage = ({ setView, deliveryOption }) => {
    const { cart, clearCart } = useContext(CartContext);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal + deliveryOption.fee;

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (isPlacingOrder) return;

        setIsPlacingOrder(true);
        setTimeout(() => {
            const newOrder = {
                id: `STYLO-${Date.now()}`,
                date: new Date().toISOString(),
                items: cart,
                total: finalTotal,
                deliveryOption: deliveryOption
            };
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
            clearCart();
            setView({ page: 'orderConfirmation', order: newOrder });
            setIsPlacingOrder(false);
        }, 1500);
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="checkout-content">
                <div className="checkout-form">
                    <form onSubmit={handlePlaceOrder}>
                        <section>
                            <h2>Shipping Address</h2>
                            <input type="text" placeholder="Full Name" required />
                            <input type="text" placeholder="Address Line 1" required />
                            <input type="text" placeholder="Address Line 2" />
                            <div className="form-row">
                                <input type="text" placeholder="City" required />
                                <input type="text" placeholder="Pincode" required />
                            </div>
                             <input type="tel" placeholder="Mobile Number" required />
                        </section>
                        <section>
                            <h2>Payment Method</h2>
                            <div className="payment-methods">
                                <div className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                                    <h4>Credit/Debit Card</h4>
                                </div>
                                <div className={`payment-method-card ${paymentMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMethod('upi')}>
                                    <h4>UPI / Wallets</h4>
                                    <p className="upi-icons">GPay, PhonePe, Paytm</p>
                                </div>
                            </div>
                             {paymentMethod === 'card' && (
                                <div className="card-details">
                                    <input type="text" placeholder="Card Number" />
                                    <div className="form-row">
                                        <input type="text" placeholder="MM/YY" />
                                        <input type="text" placeholder="CVC" />
                                    </div>
                                </div>
                            )}
                        </section>
                        <button type="submit" className="confirm-pay-btn" disabled={isPlacingOrder}>
                            {isPlacingOrder ? <LoadingSpinner /> : 'Confirm & Pay'}
                        </button>
                    </form>
                </div>
                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    {cart.map(item => (
                         <div key={item.id} className="summary-item">
                             <span>{item.name} x {item.quantity}</span>
                             <span>₹{item.price * item.quantity}</span>
                         </div>
                    ))}
                    <hr/>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryOption.fee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;