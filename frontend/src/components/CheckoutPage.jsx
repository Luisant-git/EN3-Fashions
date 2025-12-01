import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { createOrder } from '../api/orderApi';
import { validateCoupon, getActiveCoupons } from '../api/couponApi';
import { createPaymentOrder, verifyPayment } from '../api/paymentApi';
import LoadingSpinner from './LoadingSpinner';
import useRazorpay from 'react-razorpay';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const deliveryOption = location.state?.deliveryOption || { fee: 50, name: 'Standard Delivery' };
    const { cart, fetchCart } = useContext(CartContext);
    const { user, token } = useContext(AuthContext);
    const [Razorpay] = useRazorpay();
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const couponInputRef = useRef(null);
    const [formData, setFormData] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        pincode: '',
        mobile: ''
    });

    useEffect(() => {
        if (user?.shippingAddress) {
            setFormData({
                fullName: user.shippingAddress.name || user.name || '',
                addressLine1: user.shippingAddress.addressLine || '',
                addressLine2: '',
                city: user.shippingAddress.city || '',
                pincode: user.shippingAddress.pincode || '',
                mobile: user.shippingAddress.mobile || user.phone || ''
            });
        } else if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                mobile: user.phone || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const coupons = await getActiveCoupons(token);
                setAvailableCoupons(coupons);
            } catch (error) {
                console.error('Failed to fetch coupons:', error);
            }
        };
        fetchCoupons();
    }, [token]);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal - discount + deliveryOption.fee;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (isPlacingOrder) return;

        setIsPlacingOrder(true);
        try {
            const razorpayOrder = await createPaymentOrder(finalTotal, token);
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                name: 'EN3 Trends',
                description: 'Order Payment',
                order_id: razorpayOrder.id,
                handler: async (response) => {
                    try {
                        const verification = await verifyPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        }, token);

                        if (verification.success) {
                            const orderData = {
                                subtotal: subtotal.toString(),
                                deliveryFee: deliveryOption.fee.toString(),
                                total: finalTotal.toString(),
                                couponCode: appliedCoupon?.code || undefined,
                                paymentMethod,
                                shippingAddress: formData,
                                deliveryOption
                            };
                            
                            const order = await createOrder(orderData);
                            await fetchCart();
                            toast.success('Payment successful! Order placed.');
                            navigate('/order-confirmation', { state: { order } });
                        }
                    } catch (error) {
                        toast.error('Payment verification failed');
                    }
                },
                prefill: {
                    name: formData.fullName,
                    contact: formData.mobile
                },
                theme: { color: '#3399cc' }
            };

            const rzp = new Razorpay(options);
            rzp.on('payment.failed', () => {
                toast.error('Payment failed. Please try again.');
            });
            rzp.open();
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to initiate payment');
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
                        <section>
                            <h2>Available Coupons</h2>
                            {availableCoupons.length > 0 && (
                                <div className="available-coupons">
                                    {availableCoupons.map(coupon => (
                                        <div key={coupon.id} className="coupon-card">
                                            <div className="coupon-info">
                                                <div className="coupon-code-badge">{coupon.code}</div>
                                                <div className="coupon-details">
                                                    <p className="coupon-value">
                                                        {coupon.type === 'percentage' 
                                                            ? `${coupon.value}% OFF` 
                                                            : `₹${coupon.value} OFF`}
                                                    </p>
                                                    <p className="coupon-min">Min order: ₹{coupon.minOrderAmount}</p>
                                                    {coupon.maxDiscount && (
                                                        <p className="coupon-max">Max discount: ₹{coupon.maxDiscount}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                type="button"
                                                className="apply-coupon-card-btn"
                                                onClick={() => {
                                                    setCouponCode(coupon.code);
                                                    couponInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    setTimeout(() => couponInputRef.current?.focus(), 300);
                                                }}
                                                disabled={appliedCoupon?.code === coupon.code}
                                            >
                                                {appliedCoupon?.code === coupon.code ? 'Applied' : 'Apply'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <h3 style={{ marginTop: '20px' }}>Enter Coupon Code</h3>
                            <div className="coupon-section" ref={couponInputRef}>
                                <input 
                                    type="text" 
                                    placeholder="Enter coupon code" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    disabled={appliedCoupon}
                                />
                                {appliedCoupon ? (
                                    <button 
                                        type="button" 
                                        className="remove-coupon-btn"
                                        onClick={() => {
                                            setAppliedCoupon(null);
                                            setDiscount(0);
                                            setCouponCode('');
                                        }}
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        className="apply-coupon-btn"
                                        onClick={async () => {
                                            if (!couponCode.trim()) return;
                                            setIsValidatingCoupon(true);
                                            try {
                                                const result = await validateCoupon(couponCode, subtotal, token);
                                                setAppliedCoupon(result.coupon);
                                                setDiscount(result.discount);
                                                toast.success(`Coupon applied! You saved ₹${result.discount}`);
                                            } catch (error) {
                                                toast.error(error.message);
                                            } finally {
                                                setIsValidatingCoupon(false);
                                            }
                                        }}
                                        disabled={isValidatingCoupon}
                                    >
                                        {isValidatingCoupon ? 'Validating...' : 'Apply'}
                                    </button>
                                )}
                            </div>
                            {appliedCoupon && (
                                <div className="coupon-applied">
                                    ✓ Coupon "{appliedCoupon.code}" applied
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
                    {discount > 0 && (
                        <div className="summary-row discount">
                            <span>Discount</span>
                            <span>-₹{discount.toFixed(2)}</span>
                        </div>
                    )}
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