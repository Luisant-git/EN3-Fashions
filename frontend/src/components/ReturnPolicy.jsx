import React from 'react';

const ReturnPolicy = () => {
    return (
        <div className="policy-page">
            <div className="container">
                <h1>Return And Exchange Policy</h1>
                <div className="policy-content">
                    <p>Last updated: 14-03-2026</p>
                    <p>At EN3 Fashions, we are committed to providing you with high-quality products. To maintain our quality standards and offer the best pricing, we follow a strict "No Return / No Refund" policy. We offer exchanges only under the following specific circumstances:</p>
                    
                    <section>
                        <h2>1. Conditions for Exchange</h2>
                        <p>An exchange will be processed only if:</p>
                        <ul>
                            <li><strong>Damaged Product:</strong> The item received is physically damaged or defective upon arrival.</li>
                            <li><strong>Incorrect Size:</strong> The size received is different from the size you ordered on the website.</li>
                            <li><strong>Incorrect Color:</strong> The color of the product received is significantly different from what was shown on our website (excluding minor shade variations due to screen brightness).</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Reporting a Problem</h2>
                        <p>To be eligible for an exchange, you must notify us within 48 hours of receiving the package.</p>
                        <ul>
                            <li><strong>Contact Us:</strong> WhatsApp us at +91 70101 24370.</li>
                            <li><strong>Proof Required:</strong> You must provide your Order ID and clear photos or an unboxing video showing the damage or the incorrect size/color tag.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Exchange Process</h2>
                        <ul>
                            <li>Once your request is verified and approved, we will arrange for the item to be picked up or ask you to ship it back to us.</li>
                            <li>The item must be unused, unwashed, and in its original packaging with all tags intact.</li>
                            <li>After we receive and inspect the item, we will ship the correct/replacement product to you at no additional cost.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicy;
