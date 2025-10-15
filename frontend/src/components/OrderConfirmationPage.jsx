import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderConfirmationPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const order = location.state?.order;
    return (
        <div className="order-confirmation-page">
            <div className="confirmation-box">
                <div className="confirmation-header">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h1>Thank you for your order!</h1>
                    <p>Your order has been placed successfully.</p>
                </div>
                <div className="confirmation-summary">
                    <h3>Order Summary</h3>
                    <p><strong>Order ID:</strong> #{order.id.slice(0, 8)}</p>
                    {order.items.map(item => (
                        <div key={item.id} className="summary-item">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    <hr/>
                    <div className="summary-row">
                        <span>Delivery</span>
                        <span>₹{order.deliveryOption.fee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total Paid</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                </div>
                <button onClick={() => navigate('/')} className="continue-shopping-btn">Continue Shopping</button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;