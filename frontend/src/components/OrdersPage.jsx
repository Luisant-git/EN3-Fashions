import React, { useState, useEffect } from 'react';
import { getUserOrders } from '../api/orderApi';
import LoadingSpinner from './LoadingSpinner';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        getUserOrders()
            .then(data => setOrders(data.filter(order => order.paymentMethod !== 'abandoned')))
            .catch(err => console.error('Failed to fetch orders:', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="orders-page"><LoadingSpinner /></div>;
    }

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
                            <h3>Order #{order.id}</h3>
                            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                            <strong>Total: ₹{parseFloat(order.total).toFixed(2)}</strong>
                        </div>
                        <div className="order-details">
                             <p><strong>Status:</strong> {order.status}</p>
                             <p><strong>Shipping Address:</strong> {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}, `}{order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                             <p><strong>Delivery:</strong> {order.deliveryOption.name} (+₹{order.deliveryOption.fee})</p>
                             {(order.status === 'Shipped' || order.status === 'Delivered') && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    {order.invoiceUrl && (
                                        <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>
                                            Download Invoice
                                        </a>
                                    )}
                                    {order.packageSlipUrl && (
                                        <a href={order.packageSlipUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 16px', background: '#10b981', color: 'white', borderRadius: '4px', textDecoration: 'none', fontSize: '14px' }}>
                                            Download Package Slip
                                        </a>
                                    )}
                                </div>
                             )}
                            {order.items.map(item => (
                                <div key={item.id} className="order-item">
                                    {item.type === 'single' ? (
                                        <>
                                            <img src={item.imageUrl} alt={item.name}/>
                                            <div>
                                                <p>{item.name}</p>
                                                <p>{item.color} | {item.size} | Qty: {item.quantity} | ₹{item.price}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <div style={{width: '100%'}}>
                                            <p>{item.name}</p>
                                            <p>Bundle | Qty: {item.quantity} | ₹{item.price}</p>
                                            <div style={{display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap'}}>
                                                {item.bundleItems?.map((bundle, idx) => (
                                                    <div key={idx} style={{textAlign: 'center'}}>
                                                        <img src={bundle.colorImage} alt={bundle.color} style={{width: '60px', height: '60px', objectFit: 'cover'}}/>
                                                        <p style={{fontSize: '0.85em', margin: '5px 0 0'}}>{bundle.color} ({bundle.size})</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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