import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartContext } from '../contexts/CartContext';
import { createOrder } from '../api/orderApi';
import LoadingSpinner from './LoadingSpinner';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const deliveryOption = location.state?.deliveryOption || { fee: 50, name: 'Standard Delivery' };
    const { cart, fetchCart } = useContext(CartContext);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        pincode: '',
        mobile: ''
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal + deliveryOption.fee;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (isPlacingOrder) return;

        setIsPlacingOrder(true);
        try {
            const orderData = {
                subtotal: subtotal.toString(),
                deliveryFee: deliveryOption.fee.toString(),
                total: finalTotal.toString(),
                paymentMethod,
                shippingAddress: formData,
                deliveryOption
            };
            
            const order = await createOrder(orderData);
            await fetchCart(); // Refresh cart to show it's empty
            toast.success('Order placed successfully!');
            navigate('/order-confirmation', { state: { order } });
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="checkout-content">
                <div className="checkout-form">
                    <form onSubmit={handlePlaceOrder}>
                        <section>
                            <h2>Shipping Address</h2>
                            <input type="text" placeholder="Full Name" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                            <input type="text" placeholder="Address Line 1" value={formData.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} required />
                            <input type="text" placeholder="Address Line 2" value={formData.addressLine2} onChange={(e) => setFormData({...formData, addressLine2: e.target.value})} />
                            <div className="form-row">
                                <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                                <input type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
                            </div>
                             <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} required />
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