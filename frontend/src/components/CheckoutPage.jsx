import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import { createOrder } from '../api/orderApi';
import { validateCoupon, getActiveCoupons } from '../api/couponApi';
import { createPaymentOrder, verifyPayment } from '../api/paymentApi';
import { getShippingRules } from '../api/shippingApi';
import LoadingSpinner from './LoadingSpinner';
const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // const deliveryOption = location.state?.deliveryOption || { fee: 50, name: 'Standard Delivery' };
    const { cart, fetchCart } = useContext(CartContext);
    const { user, token } = useContext(AuthContext);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [discount, setDiscount] = useState(0);
    const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const couponInputRef = useRef(null);
    const [selectedState, setSelectedState] = useState(null);
    const [shippingRules, setShippingRules] = useState([]);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [deliveryAvailable, setDeliveryAvailable] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
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
        const fetchShippingRules = async () => {
            try {
                const rules = await getShippingRules();
                setShippingRules(rules);
            } catch (error) {
                console.error('Failed to fetch shipping rules:', error);
            }
        };
        fetchShippingRules();
    }, []);

    const BUSINESS_STATE = 'Tamil Nadu';
    const GST_RATE = 0.05; // 5%

    const subtotal = Array.isArray(cart) ? cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

    useEffect(() => {
        if (selectedState) {
            const stateEnum = selectedState.value.toUpperCase().replace(/ /g, '_').replace(/and/g, '').replace(/__/g, '_');
            const rule = shippingRules.find(r => r.state === stateEnum);
            if (rule) {
                const subtotalAfterDiscount = subtotal - discount;
                if (subtotalAfterDiscount >= 999) {
                    setDeliveryFee(0);
                } else {
                    setDeliveryFee(rule.flatShippingRate);
                }
                setDeliveryAvailable(true);
            } else {
                setDeliveryFee(0);
                setDeliveryAvailable(false);
            }
        }
    }, [selectedState, shippingRules, subtotal, discount]);
    const subtotalAfterDiscount = subtotal - discount;
    
    const isSameState = selectedState?.value === BUSINESS_STATE;
    const gstAmount = subtotalAfterDiscount * GST_RATE;
    const cgst = isSameState ? gstAmount / 2 : 0;
    const sgst = isSameState ? gstAmount / 2 : 0;
    const igst = !isSameState ? gstAmount : 0;
    
    const finalTotal = subtotalAfterDiscount + gstAmount + deliveryFee;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (isPlacingOrder) return;
        if (!selectedState) {
            toast.error('Please select a state');
            return;
        }
        if (!deliveryAvailable) {
            toast.error('Delivery not available for your state');
            return;
        }

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
                    setIsPlacingOrder(true);
                    try {
                        const verification = await verifyPayment({
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature
                        }, token);

                        if (verification.success) {
                            const orderData = {
                                subtotal: subtotal.toString(),
                                deliveryFee: deliveryFee.toString(),
                                total: finalTotal.toString(),
                                discount: discount.toString(),
                                couponCode: appliedCoupon?.code || undefined,
                                paymentMethod: 'razorpay',
                                shippingAddress: { ...formData, state: selectedState.value },
                                deliveryOption: { 
                                    fee: deliveryFee, 
                                    name: 'Standard Delivery',
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
                            
                            const order = await createOrder(orderData);
                            await fetchCart();
                            toast.success('Payment successful! Order placed.');
                            setTimeout(() => {
                                navigate('/order-confirmation', { state: { order }, replace: true });
                            }, 500);
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Order creation error:', error);
                        toast.error('Payment received but order failed. Contact support.');
                    } finally {
                        setIsPlacingOrder(false);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    contact: formData.mobile
                },
                theme: { color: '#3399cc' }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response) => {
                setIsPlacingOrder(false);
                toast.error('Payment failed: ' + (response.error?.description || 'Please try again'));
            });
            rzp.open();
            setIsPlacingOrder(false);
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
                            <input type="text" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                            <Select
                                options={stateOptions}
                                value={selectedState}
                                onChange={setSelectedState}
                                placeholder="Select State"
                                isSearchable
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        padding: '4px',
                                        borderRadius: '5px',
                                        border: state.isFocused ? '1px solid #000' : '1px solid #e0e0e0',
                                        marginBottom: '15px',
                                        boxShadow: 'none',
                                        fontFamily: 'Montserrat, sans-serif',
                                        '&:hover': {
                                            borderColor: state.isFocused ? '#000' : '#e0e0e0'
                                        }
                                    }),
                                    placeholder: (base) => ({
                                        ...base,
                                        fontFamily: 'Montserrat, sans-serif'
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        fontFamily: 'Montserrat, sans-serif'
                                    })
                                }}
                            />
                            <input type="text" placeholder="Pincode" value={formData.pincode} onChange={(e) => setFormData({...formData, pincode: e.target.value})} required />
                             <input type="tel" placeholder="Mobile Number" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} required />
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
                            {isPlacingOrder ? <LoadingSpinner /> : 'Make Payment'}
                        </button>
                    </form>
                </div>
                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    {Array.isArray(cart) && cart.map(item => (
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
                        <div className="summary-row">
                            <span>Delivery Fee</span>
                            <span>
                                {deliveryFee === 0 && subtotalAfterDiscount >= 999 ? (
                                    <span style={{ color: '#4CAF50', fontWeight: '600' }}>FREE</span>
                                ) : (
                                    `₹${deliveryFee.toFixed(2)}`
                                )}
                            </span>
                        </div>
                    )}
                    {selectedState && !deliveryAvailable && (
                        <div className="summary-row" style={{ color: '#ef4444' }}>
                            <span>Delivery not available for your state</span>
                        </div>
                    )}
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