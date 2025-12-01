import React from 'react';

const ReturnPolicy = () => {
    return (
        <div className="policy-page">
            <div className="container">
                <h1>Return & Refund Policy</h1>
                <div className="policy-content">
                    <p>Last updated: 01-12-2025</p>
                    <p>At EN3 Fashions, we want you to be completely satisfied with your purchase.</p>
                    
                    <section>
                        <h2>1. Return Eligibility</h2>
                        <p>You can request a return if:</p>
                        <ul>
                            <li>You received a damaged or defective product</li>
                            <li>Wrong item or size delivered</li>
                            <li>Product is unused and in original condition</li>
                            <li>Return request is placed within 7 days of delivery</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Non-returnable Items</h2>
                        <ul>
                            <li>Innerwear, cosmetics, beauty products</li>
                            <li>Items on clearance or final sale</li>
                            <li>Used, washed, or damaged items</li>
                            <li>Products without original tags/packaging</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Return Process</h2>
                        <ul>
                            <li>Email us at support@en3fashions.in with order details.</li>
                            <li>Provide product photos/video for verification.</li>
                            <li>Once approved, pickup will be arranged.</li>
                            <li>Upon inspection, refund/replacement will be processed.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Refund Policy</h2>
                        <p>Refunds will be issued to:</p>
                        <ul>
                            <li>Original payment method (5–7 business days)</li>
                        </ul>
                        <p>Refund may be rejected if:</p>
                        <ul>
                            <li>Product is used or damaged</li>
                            <li>Tags/packaging missing</li>
                            <li>Mismatch with original order</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
