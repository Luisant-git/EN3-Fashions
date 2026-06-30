import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'react-toastify';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { createOrder } from '../api/orderApi';
import { validateCoupon, getActiveCoupons } from '../api/couponApi';
import { createPaymentOrder, verifyPayment } from '../api/paymentApi';
import { getShippingRules } from '../api/shippingApi';
import { updateShippingAddress } from '../api/authApi';
import API_BASE_URL from '../config/api';
import LoadingSpinner from './LoadingSpinner';
import { getAppSettings } from '../api/settingsApi';

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, fetchCart } = useContext(CartContext);
    const { user, token, refreshUser } = useContext(AuthContext);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const couponInputRef = useRef(null);
    const [selectedState, setSelectedState] = useState(null);
    const [shippingRules, setShippingRules] = useState([]);
    const [baseDeliveryFee, setBaseDeliveryFee] = useState(0);
    const [codShippingFee, setCodShippingFee] = useState(30);
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [deliveryAvailable, setDeliveryAvailable] = useState(true);
    const [codAvailable, setCodAvailable] = useState(true);
    const [showCodModal, setShowCodModal] = useState(false);
    const [showMobileSummaryModal, setShowMobileSummaryModal] = useState(false);
    
    // COD OTP States
    const [showCodOtpModal, setShowCodOtpModal] = useState(false);
    const [codOtp, setCodOtp] = useState('');
    const [codOtpTimer, setCodOtpTimer] = useState(0);
    const [codOtpLoading, setCodOtpLoading] = useState(false);
    const [codOtpVerified, setCodOtpVerified] = useState(false);

    const [formData, setFormData] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        landmark: '',
        city: '',
        pincode: '',
        mobile: ''
    });

    const stateOptions = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
        'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
        'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
        'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
    ].map(state => ({ value: state, label: state }));

    useEffect(() => {
        if (user?.shippingAddress) {
            setFormData({
                fullName: user.shippingAddress.name || user.name || '',
                addressLine1: user.shippingAddress.addressLine || '',
                addressLine2: '',
                landmark: user.shippingAddress.landmark || '',
                city: user.shippingAddress.city || '',
                pincode: user.shippingAddress.pincode || '',
                mobile: user.shippingAddress.mobile || user.phone || ''
            });
            if (user.shippingAddress.state) {
                setSelectedState({ value: user.shippingAddress.state, label: user.shippingAddress.state });
            }
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rules, settings] = await Promise.all([
                    getShippingRules(),
                    getAppSettings()
                ]);
                setShippingRules(rules);
                if (settings && settings.codShippingCharge) {
                    setCodShippingFee(Number(settings.codShippingCharge));
                } else {
                    setCodShippingFee(30);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };
        fetchData();
    }, []);

    const BUSINESS_STATE = 'Tamil Nadu';
    const GST_RATE = 0.05; // 5%

    const subtotal = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

    useEffect(() => {
        if (selectedState) {
            const stateEnum = selectedState.value.toUpperCase().replace(/ /g, '_').replace(/and/g, '').replace(/__/g, '_');
            const rule = shippingRules.find(r => r.state === stateEnum);
            if (rule) {
                setBaseDeliveryFee(rule.flatShippingRate);
                setDeliveryAvailable(true);
                setCodAvailable(rule.codAvailable !== false); // Check COD availability
                // If COD is not available and currently selected, switch to online
                if (rule.codAvailable === false && paymentMethod === 'cod') {
                    setPaymentMethod('online');
                }
            } else {
                setBaseDeliveryFee(0);
                setDeliveryAvailable(false);
                setCodAvailable(false);
            }
        }
    }, [selectedState, shippingRules]);

    useEffect(() => {
        if (appliedCoupon) {
            const revalidate = async () => {
                try {
                    const cartItemsPayload = Array.isArray(cart) ? cart.map(item => ({
                        productId: item.productId,
                        price: item.price,
                        quantity: item.quantity,
                    })) : [];
                    const result = await validateCoupon(
                        appliedCoupon.code, 
                        subtotal, 
                        baseDeliveryFee, 
                        paymentMethod === 'cod' ? codShippingFee : 0, 
                        token,
                        cartItemsPayload
                    );
                    setDiscount(result.discount);
                } catch (e) {
                    setAppliedCoupon(null);
                    setDiscount(0);
                    // Silent ignore during automatic re-validation
                }
            }
            revalidate();
        }
    }, [paymentMethod, subtotal, baseDeliveryFee, codShippingFee]);

    const deliveryFee = paymentMethod === 'cod' ? (baseDeliveryFee + codShippingFee) : baseDeliveryFee;
    const subtotalAfterDiscount = subtotal - discount;
    
    const isSameState = selectedState?.value === BUSINESS_STATE;
    // GST Inclusive calculation
    const baseAmount = subtotalAfterDiscount / (1 + GST_RATE);
    const gstAmount = subtotalAfterDiscount - baseAmount;
    const cgst = isSameState ? gstAmount / 2 : 0;
    const sgst = isSameState ? gstAmount / 2 : 0;
    const igst = !isSameState ? gstAmount : 0;
    
    const finalTotal = subtotalAfterDiscount + deliveryFee;

    const handleSelectPaymentMethod = (method) => {
        if (method === 'cod') {
            if (paymentMethod === 'cod') return; // already selected
            setShowCodModal(true);
        } else {
            setPaymentMethod('online');
        }
    };

    useEffect(() => {
        if (codOtpTimer > 0) {
            const interval = setInterval(() => setCodOtpTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [codOtpTimer]);

    const requestCodOtp = async (phone) => {
        if (!/^\d{10}$/.test(phone)) {
            toast.error('Valid 10-digit mobile number required for COD verification');
            return;
        }
        setCodOtpLoading(true);
        try {
            const API_URL = API_BASE_URL || 'http://195.35.22.221:4062';
            await axios.post(`${API_URL}/auth/otp/request`, { phone });
            toast.success('OTP sent to WhatsApp!');
            setCodOtpTimer(300);
            setShowCodOtpModal(true);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to send OTP');
        } finally {
            setCodOtpLoading(false);
        }
    };

    const verifyCodOtp = async (e) => {
        e.preventDefault();
        setCodOtpLoading(true);
        try {
            const API_URL = API_BASE_URL || 'http://195.35.22.221:4062';
            await axios.post(`${API_URL}/auth/otp/verify`, { phone: formData.mobile, otp: codOtp });
            toast.success('COD order confirmed! Placing order...');
            setCodOtpVerified(true);
            setShowCodOtpModal(false);
            // After verification, we trigger handlePlaceOrder without the event to bypass the modal check
            handlePlaceOrder();
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Invalid OTP');
        } finally {
            setCodOtpLoading(false);
        }
    };

    const handlePlaceOrder = async (e) => {
        if (e) e.preventDefault();
        if (isPlacingOrder) return;
        if (!selectedState) {
            toast.error('Please select a state');
            return;
        }
        if (!deliveryAvailable) {
            toast.error('Delivery not available for your state');
            return;
        }
        
        if (e && window.innerWidth <= 768 && !showMobileSummaryModal) {
            setShowMobileSummaryModal(true);
            return;
        }

        if (paymentMethod === 'cod' && !codOtpVerified) {
            requestCodOtp(formData.mobile);
            return;
        }

        setIsPlacingOrder(true);
        try {
            // Save shipping address to user profile
            try {
                const addressData = {
                    name: formData.fullName,
                    addressLine: formData.addressLine1,
                    landmark: formData.landmark,
                    city: formData.city,
                    state: selectedState.value,
                    pincode: formData.pincode,
                    mobile: formData.mobile
                };
                await updateShippingAddress(token, addressData);
            } catch (addressError) {
                console.error('Failed to save address to profile:', addressError);
                // Don't stop the order process if address saving fails
            }

            // Create order first
            const orderData = {
                subtotal: subtotal.toString(),
                deliveryFee: baseDeliveryFee.toString(),
                codFee: (paymentMethod === 'cod' ? codShippingFee : 0).toString(),
                total: finalTotal.toString(),
                discount: discount.toString(),
                couponCode: appliedCoupon?.code || undefined,
                paymentMethod: paymentMethod,
                shippingAddress: { ...formData, state: selectedState.value },
                deliveryOption: { 
                    fee: deliveryFee, // Still passed in deliveryOption for invoice backwards compat
                    name: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Standard Delivery',
                    gst: {
                        rate: GST_RATE,
                        amount: gstAmount,
                        cgst: cgst,
                        sgst: sgst,
                        igst: igst,
                        isSameState: isSameState
                    }
                }
            };
            
            const orderResponse = await createOrder(orderData);
            
            if (paymentMethod === 'cod') {
                await fetchCart();
                await refreshUser();
                toast.success('Order placed successfully (Cash on Delivery)!');
                setTimeout(() => {
                    navigate('/order-confirmation', { state: { order: orderResponse }, replace: true });
                }, 500);
                setIsPlacingOrder(false);
                return;
            }

            const dbOrderId = orderResponse.id;
            const razorpayOrderId = orderResponse.razorpayOrderId;
            
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: Math.round(finalTotal * 100),
                currency: 'INR',
                name: 'EN3 Trends',
                description: 'Order Payment',
                order_id: razorpayOrderId,
                handler: async (response) => {
                    setIsPlacingOrder(true);
                    try {
                        console.log('Razorpay response:', response);
                        console.log('Available keys:', Object.keys(response));
                        
                        const verification = await verifyPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            dbOrderId: dbOrderId
                        }, token);

                        if (verification.success) {
                            await fetchCart();
                            await refreshUser(); // Refresh user profile with updated shipping address
                            toast.success('Payment successful! Order placed.');
                            setTimeout(() => {
                                navigate('/order-confirmation', { state: { order: orderResponse }, replace: true });
                            }, 500);
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Payment verification error:', error);
                        toast.error('Payment verification failed. Contact support with Order ID: ' + dbOrderId);
                    } finally {
                        setIsPlacingOrder(false);
                    }
                },
                modal: {
                    ondismiss: async () => {
                        setIsPlacingOrder(false);
                        toast.info('Payment cancelled.');
                    }
                },
                prefill: {
                    name: formData.fullName,
                    contact: formData.mobile
                },
                theme: { color: '#3399cc' }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', async (response) => {
                setIsPlacingOrder(false);
                // Refresh user profile even when payment fails
                await refreshUser();
                toast.error('Payment failed: ' + (response.error?.description || 'Please try again'));
            });
            
            rzp.open();
            setIsPlacingOrder(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to create order');
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
                            <input type="text" placeholder="Landmark" value={formData.landmark} onChange={(e) => setFormData({...formData, landmark: e.target.value})} />
                            <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                            <select 
                                value={selectedState?.value || ''} 
                                onChange={(e) => setSelectedState(e.target.value ? { value: e.target.value, label: e.target.value } : null)}
                                required
                            >
                                <option value="">Select State</option>
                                {stateOptions.map(state => (
                                    <option key={state.value} value={state.value}>{state.label}</option>
                                ))}
                            </select>
                            <input type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
                             <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => { setFormData({...formData, mobile: e.target.value}); setCodOtpVerified(false); }} required />
                        </section>

                        <section>
                            <h2>Available Coupons</h2>
                            {availableCoupons.length > 0 && (
                                <div className="available-coupons">
                                    {availableCoupons.map((coupon) => (
                                        <div 
                                            key={coupon.id} 
                                            className="coupon-card"
                                            onClick={() => {
                                                if (!appliedCoupon) {
                                                    setCouponCode(coupon.code);
                                                    couponInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                                    setTimeout(() => couponInputRef.current?.focus(), 300);
                                                }
                                            }}
                                            style={{ cursor: appliedCoupon ? 'default' : 'pointer' }}
                                        >
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
                                                const cartItemsPayload = Array.isArray(cart) ? cart.map(item => ({
                                                        productId: item.productId,
                                                        price: item.price,
                                                        quantity: item.quantity,
                                                    })) : [];
                                                const result = await validateCoupon(
                                                    couponCode, 
                                                    subtotal, 
                                                    baseDeliveryFee, 
                                                    paymentMethod === 'cod' ? codShippingFee : 0, 
                                                    token,
                                                    cartItemsPayload
                                                );
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

                        <section>
                            <h2>Payment Method</h2>
                            <div className="payment-methods">
                                <div 
                                    className={`payment-method-card ${paymentMethod === 'online' ? 'selected' : ''}`}
                                    onClick={() => handleSelectPaymentMethod('online')}
                                >
                                    <input 
                                        type="radio" 
                                        name="paymentMethod" 
                                        checked={paymentMethod === 'online'} 
                                        onChange={() => handleSelectPaymentMethod('online')}
                                    />
                                    <div className="payment-method-icon">
                                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                                        </svg>
                                    </div>
                                    <div className="payment-method-info">
                                        <span className="payment-method-name">Online Payment</span>
                                        <span className="payment-method-desc">Secure payment via Razorpay, UPI, Card, NetBanking</span>
                                    </div>
                                </div>
                                {codAvailable ? (
                                    <div 
                                        className={`payment-method-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                        onClick={() => handleSelectPaymentMethod('cod')}
                                    >
                                        <input 
                                            type="radio" 
                                            name="paymentMethod" 
                                            checked={paymentMethod === 'cod'} 
                                            onChange={() => handleSelectPaymentMethod('cod')}
                                        />
                                        <div className="payment-method-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="1" y="3" width="15" height="13"></rect>
                                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                            </svg>
                                        </div>
                                        <div className="payment-method-info">
                                            <span className="payment-method-name">
                                                Cash on Delivery 
                                                {codShippingFee > 0 && <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>+ ₹{codShippingFee} Charge</span>}
                                            </span>
                                            <span className="payment-method-desc">Pay in cash upon delivery at your doorstep</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="payment-method-card disabled" style={{ opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#f9fafb' }}>
                                        <div className="payment-method-icon">
                                            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="1" y="3" width="15" height="13"></rect>
                                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                                <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                            </svg>
                                        </div>
                                        <div className="payment-method-info">
                                            <span className="payment-method-name" style={{ color: '#6b7280' }}>
                                                Cash on Delivery
                                            </span>
                                            <span className="payment-method-desc" style={{ color: '#ef4444', fontWeight: '500' }}>
                                                Not available for {selectedState?.value || 'this state'}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                        <button type="submit" className="confirm-pay-btn" style={{ marginTop: '30px' }} disabled={isPlacingOrder || codOtpLoading}>
                            {(isPlacingOrder || codOtpLoading) ? <LoadingSpinner /> : (paymentMethod === 'cod' ? 'Place Order (COD)' : 'Make Payment')}
                        </button>
                    </form>
                </div>
                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    {Array.isArray(cart) && cart.map(item => (
                         <div key={item.id} className="summary-item summary-item-compact">
                             <img src={item.imageUrl} alt={item.name} className="summary-item-img" />
                             <div className="summary-item-info">
                                 <span className="summary-item-title">{item.name} x {item.quantity || 1}</span>
                             </div>
                             <span className="summary-item-price">₹{item.price * (item.quantity || 1)}</span>
                         </div>
                    ))}
                    <hr/>
                    <div className="summary-row">
                        <span>Subtotal (incl. GST)</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {selectedState && (
                        <div className="summary-row">
                            <span>Taxable Amount</span>
                            <span>₹{baseAmount.toFixed(2)}</span>
                        </div>
                    )}
                    {selectedState && isSameState && (
                        <>
                            <div className="summary-row">
                                <span>CGST (2.5%)</span>
                                <span>₹{cgst.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>SGST (2.5%)</span>
                                <span>₹{sgst.toFixed(2)}</span>
                            </div>
                        </>
                    )}
                    {selectedState && !isSameState && (
                        <div className="summary-row">
                            <span>IGST (5%)</span>
                            <span>₹{igst.toFixed(2)}</span>
                        </div>
                    )}
                    {selectedState && deliveryAvailable && (
                        <>
                            <div className="summary-row">
                                <span>Delivery Fee</span>
                                <span>₹{baseDeliveryFee.toFixed(2)}</span>
                            </div>
                            {paymentMethod === 'cod' && codShippingFee > 0 && (
                                <div className="summary-row">
                                    <span>COD Charge</span>
                                    <span>₹{codShippingFee.toFixed(2)}</span>
                                </div>
                            )}
                        </>
                    )}
                    {selectedState && !deliveryAvailable && (
                        <div className="summary-row" style={{ color: '#ef4444' }}>
                            <span>Delivery not available for your state</span>
                        </div>
                    )}
                    {discount > 0 && (
                        <div className="summary-row discount" style={{ borderTop: '1px solid #eee', paddingTop: '8px', color: '#16a34a', fontWeight: '500' }}>
                            <span>Discount Applied</span>
                            <span>-₹{discount.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {showCodModal && (
                <div className="cod-modal-overlay">
                    <div className="cod-modal">
                        <div className="cod-modal-header">
                            <h3>Confirm Cash on Delivery</h3>
                            <button type="button" className="cod-modal-close" onClick={() => setShowCodModal(false)}>&times;</button>
                        </div>
                        <div className="cod-modal-body" style={{ textAlign: 'center', padding: '15px' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>💡</div>
                            <h4 style={{ fontSize: '1.2rem', marginBottom: '10px', color: '#333', fontWeight: '600' }}>
                                Save extra charges!
                            </h4>
                            <p style={{ color: '#555', marginBottom: '15px', lineHeight: '1.5' }}>
                                Cash on Delivery has an additional handling fee of <strong>₹{codShippingFee}</strong>.
                            </p>
                            <div style={{ backgroundColor: '#dcfce7', color: '#16a34a', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem' }}>
                                Pay online securely and save ₹{codShippingFee} instantly!
                            </div>
                        </div>
                        <div className="cod-modal-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '0 20px 20px' }}>
                            <button type="button" onClick={() => setShowCodModal(false)} style={{ width: '100%', backgroundColor: '#16a34a', color: 'white', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', margin: 0 }}>
                                Pay Online & Save ₹{codShippingFee}
                            </button>
                            <button 
                                type="button" 
                                style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', padding: '12px', borderRadius: '6px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', margin: 0 }}
                                onClick={() => {
                                    setPaymentMethod('cod');
                                    setShowCodModal(false);
                                    toast.success(`Switched to COD! Extra ₹${codShippingFee} charge applied.`);
                                }}
                            >
                                Continue with COD (+₹{codShippingFee})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMobileSummaryModal && (
                <div className="cod-modal-overlay" style={{ zIndex: 1000 }}>
                    <div className="cod-modal" style={{ width: '95%', maxWidth: '400px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
                        <div className="cod-modal-header">
                            <h3>Confirm Your Order</h3>
                            <button type="button" className="cod-modal-close" onClick={() => setShowMobileSummaryModal(false)}>&times;</button>
                        </div>
                        <div className="cod-modal-body" style={{ overflowY: 'auto', flex: 1, padding: '10px 20px' }}>
                            {Array.isArray(cart) && cart.map(item => (
                                <div key={item.id} className="summary-item summary-item-compact">
                                    <img src={item.imageUrl} alt={item.name} className="summary-item-img" />
                                    <div className="summary-item-info">
                                        <span className="summary-item-title">{item.name} x {item.quantity || 1}</span>
                                    </div>
                                    <span className="summary-item-price">₹{item.price * (item.quantity || 1)}</span>
                                </div>
                            ))}
                            <hr style={{ margin: '15px 0' }} />
                            <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                <span>Subtotal (incl. GST)</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            {selectedState && (
                                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span>Taxable Amount</span>
                                    <span>₹{baseAmount.toFixed(2)}</span>
                                </div>
                            )}
                            {selectedState && isSameState && (
                                <>
                                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span>CGST (2.5%)</span>
                                        <span>₹{cgst.toFixed(2)}</span>
                                    </div>
                                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span>SGST (2.5%)</span>
                                        <span>₹{sgst.toFixed(2)}</span>
                                    </div>
                                </>
                            )}
                            {selectedState && !isSameState && (
                                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span>IGST (5%)</span>
                                    <span>₹{igst.toFixed(2)}</span>
                                </div>
                            )}
                            {selectedState && deliveryAvailable && (
                                <>
                                    <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                        <span>Delivery Fee</span>
                                        <span>₹{baseDeliveryFee.toFixed(2)}</span>
                                    </div>
                                    {paymentMethod === 'cod' && codShippingFee > 0 && (
                                        <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
                                            <span>COD Charge</span>
                                            <span>₹{codShippingFee.toFixed(2)}</span>
                                        </div>
                                    )}
                                </>
                            )}
                            {selectedState && !deliveryAvailable && (
                                <div className="summary-row" style={{ color: '#ef4444', marginBottom: '8px', fontSize: '0.9rem' }}>
                                    <span>Delivery not available for your state</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="summary-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#16a34a', fontSize: '0.9rem', fontWeight: '500', borderTop: '1px solid #eee', paddingTop: '8px' }}>
                                    <span>Discount Applied</span>
                                    <span>-₹{discount.toFixed(2)}</span>
                                </div>
                            )}
                            <hr style={{ margin: '15px 0' }} />
                            <div className="summary-row total" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', margin: '10px 0' }}>
                                <span>Total to Pay</span>
                                <span>₹{finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="cod-modal-footer">
                            <button type="button" className="cod-modal-cancel-btn" onClick={() => setShowMobileSummaryModal(false)}>
                                Back
                            </button>
                            <button 
                                type="button" 
                                className="confirm-pay-btn"
                                style={{ margin: 0 }}
                                onClick={() => {
                                    handlePlaceOrder();
                                }}
                                disabled={isPlacingOrder || codOtpLoading}
                            >
                                {(isPlacingOrder || codOtpLoading) ? <LoadingSpinner /> : (paymentMethod === 'cod' ? 'Place Order (COD)' : 'Make Payment')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCodOtpModal && (
                <div className="cod-modal-overlay" style={{ zIndex: 1100 }}>
                    <div className="auth-container" style={{ position: 'relative' }}>
                        <button 
                            type="button" 
                            onClick={() => setShowCodOtpModal(false)}
                            style={{ 
                                position: 'absolute', 
                                top: '15px', 
                                right: '15px',
                                background: 'white',
                                color: '#ef4444',
                                border: '1px solid #ef4444',
                                borderRadius: '4px',
                                width: '24px',
                                height: '24px',
                                fontSize: '1.2rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                padding: 0
                            }}
                        >
                            &times;
                        </button>
                        <h2>Confirm COD Order</h2>
                        <form onSubmit={verifyCodOtp}>
                            <p style={{ marginTop: 0, marginBottom: '20px', color: '#555', fontSize: '0.95rem' }}>
                                We sent an OTP to your WhatsApp number <strong>{formData.mobile}</strong>
                            </p>
                            <input 
                                type="text" 
                                placeholder="Enter OTP" 
                                value={codOtp} 
                                onChange={e => setCodOtp(e.target.value)} 
                                maxLength={6} 
                                required
                            />
                            <button type="submit" disabled={codOtpLoading}>
                                {codOtpLoading ? <LoadingSpinner /> : 'Verify & Place Order'}
                            </button>
                            <p style={{ marginTop: '10px' }}>
                                {codOtpTimer > 0 ? (
                                    <span>Resend OTP in {Math.floor(codOtpTimer / 60)}:{(codOtpTimer % 60).toString().padStart(2, '0')}</span>
                                ) : (
                                    <a href="#" onClick={(e) => { e.preventDefault(); requestCodOtp(formData.mobile); }}>Resend OTP</a>
                                )}
                            </p>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;