import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="policy-page">
            <div className="container">
                <h1>Shipping Policy</h1>
                <div className="policy-content">
                    <p>Last updated: 01-12-2025</p>
                    
                    <section>
                        <h2>1. Shipping Locations</h2>
                        <p>We currently ship across India.</p>
                    </section>

                    <section>
                        <h2>2. Shipping Time</h2>
                        <p>Orders are processed within 1–2 business days.</p>
                        <p>Typical delivery time:</p>
                        <ul>
                            <li>Metro cities: 3–5 days</li>
                            <li>Other areas: 5–8 days</li>
                        </ul>
                        <p>(Delays may occur due to weather, logistics issues, or festive seasons.)</p>
                    </section>

                    <section>
                        <h2>3. Shipping Charges</h2>
                        <ul>
                            <li>Free shipping on orders above ₹999</li>
                            <li>Standard shipping fee on orders below the limit</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Order Tracking</h2>
                        <p>You will receive:</p>
                        <ul>
                            <li>Order confirmation email/SMS</li>
                            <li>Tracking link once dispatched</li>
                        </ul>
                    </section>

                    <section>
                        <h2>5. Incorrect Address</h2>
                        <p>If shipping details provided are incorrect, customer will be responsible for additional charges or delays.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;