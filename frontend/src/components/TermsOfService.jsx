import React, { useEffect } from 'react';

const TermsOfService = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="policy-page">
            <div className="container">
                <h1>Terms & Conditions</h1>
                <div className="policy-content">
                    <p>Last updated: 01-12-2025</p>
                    <p>Welcome to EN3 Fashions (https://en3fashions.in). By using our website and services, you agree to these Terms.</p>
                    
                    <section>
                        <h2>1. Use of Website</h2>
                        <ul>
                            <li>You must not misuse the website for fraud or illegal activities.</li>
                            <li>All content, images, and designs belong to EN3 Fashions and cannot be copied without permission.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. Product Information</h2>
                        <p>We try our best to provide accurate product details.</p>
                        <p>Colors may slightly vary due to lighting or screen settings.</p>
                    </section>

                    <section>
                        <h2>3. Pricing & Payments</h2>
                        <ul>
                            <li>Prices may change without notice.</li>
                            <li>We accept online payments through secure gateways.</li>
                            <li>Orders may be cancelled if payment fails or for any suspicious activity.</li>
                        </ul>
                    </section>

                    <section>
                        <h2>4. Order Cancellation</h2>
                        <p>We may cancel an order due to:</p>
                        <ul>
                            <li>Out-of-stock items</li>
                            <li>Payment issues</li>
                            <li>Incorrect details provided by customer</li>
                            <li>Logistics unavailability</li>
                        </ul>
                        <p>Customers may cancel an order before dispatch.</p>
                    </section>

                    <section>
                        <h2>5. Liability</h2>
                        <p>EN3 Fashions is not responsible for:</p>
                        <ul>
                            <li>Delays caused by couriers</li>
                            <li>Losses due to incorrect address submission</li>
                            <li>Unauthorized use of your account</li>
                        </ul>
                    </section>

                    <section>
                        <h2>6. Governing Law</h2>
                        <p>These Terms are governed by the laws of India.</p>
                    </section>

                    <section>
                        <h2>7. Contact Us</h2>
                        <p>Email: ibxmarketplace@gmail.com</p>
                        <p>Phone: +91 9597689888</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;