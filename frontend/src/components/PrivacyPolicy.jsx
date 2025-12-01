import React, { useEffect } from 'react';

const PrivacyPolicy = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="policy-page">
            <div className="container">
                <h1>Privacy Policy</h1>
                <div className="policy-content">
                    <p>Last updated: 01-12-2025</p>
                    <p>At EN3 Fashions (https://en3fashions.in), we value the trust you place in us. This Privacy Policy explains how we collect, use, store, and protect your personal information.</p>
                    
                    <section>
                        <h2>1. Information We Collect</h2>
                        <p>We may collect the following information:</p>
                        <ul>
                            <li>Name, Email address, Phone number</li>
                            <li>Billing and Shipping address</li>
                            <li>Payment details (processed securely by our payment partners)</li>
                            <li>Order history & preferences</li>
                            <li>Device information, IP address, cookies, browsing behaviour</li>
                            <li>Any information you submit through forms or customer support</li>
                        </ul>
                    </section>

                    <section>
                        <h2>2. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul>
                            <li>Process and deliver orders</li>
                            <li>Provide customer support</li>
                            <li>Improve our website and services</li>
                            <li>Send order updates, offers, and notifications</li>
                            <li>Prevent fraud and enhance security</li>
                        </ul>
                    </section>

                    <section>
                        <h2>3. Sharing of Information</h2>
                        <p>We may share information with:</p>
                        <ul>
                            <li>Payment gateway providers</li>
                            <li>Courier & logistics partners</li>
                            <li>Website hosting & analytics providers</li>
                            <li>Law enforcement (if legally required)</li>
                        </ul>
                        <p>We never sell or misuse your personal data.</p>
                    </section>

                    <section>
                        <h2>4. Cookies</h2>
                        <p>We use cookies to improve browsing experience, analyze traffic, and personalize content.</p>
                    </section>

                    <section>
                        <h2>5. Data Security</h2>
                        <p>We use industry-standard security practices to protect your data. However, no online system is 100% secure.</p>
                    </section>

                    <section>
                        <h2>6. Your Rights</h2>
                        <p>You may:</p>
                        <ul>
                            <li>Request access, correction, or deletion of your data</li>
                            <li>Opt-out of marketing emails or SMS</li>
                        </ul>
                    </section>

                    <section>
                        <h2>7. Contact Us</h2>
                        <p>For privacy concerns:</p>
                        <p>Email: ibxmarketplace@gmail.com</p>
                        <p>Phone: +91 9597689888</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;