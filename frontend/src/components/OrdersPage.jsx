import React, { useState, useEffect } from 'react';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
    }, []);

    if (orders.length === 0) {
        return <div className="orders-page empty-orders"><h2>No Past Orders</h2><p>You haven't placed any orders yet.</p></div>;
    }

    return (
        <div className="orders-page">
            <h1>My Orders</h1>
            <div className="orders-list">
                {orders.map((order, index) => (
                    <div key={index} className="order-card">
                        <div className="order-header">
                            <h3>Order #{order.id.slice(0, 8)}</h3>
                            <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                            <strong>Total: ₹{order.total.toFixed(2)}</strong>
                        </div>
                        <div className="order-details">
                             <p><strong>Delivery:</strong> {order.deliveryOption.name} (+₹{order.deliveryOption.fee})</p>
                            {order.items.map(item => (
                                <div key={item.id} className="order-item">
                                    <img src={item.imageUrl} alt={item.name}/>
                                    <div>
                                        <p>{item.name}</p>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrdersPage;