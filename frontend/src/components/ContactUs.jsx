import React, { useEffect } from 'react';

const ContactUs = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="policy-page">
            <div className="container">
                <h1>Contact Us</h1>
                <div className="policy-content">
                    <section>
                        <h2>Get in Touch</h2>
                        <p>We'd love to hear from you! Reach out to us for any queries, support, or feedback.</p>
                    </section>

                    <section>
                        <h2>Our Address</h2>
                        <p>3/4 KPG Building, Jothi Theater Road,</p>
                        <p>Valipalayam, Tirupur-641601</p>
                    </section>

                    <section>
                        <h2>Contact Information</h2>
                        <p><strong>Email ID:</strong> ibxmarketplace@gmail.com</p>
                        <p><strong>Phone No:</strong> +91 95976 89888</p>
                    </section>

                    <section>
                        <h2>Business Hours</h2>
                        <p>Monday - Saturday: 9:00 AM - 7:00 PM</p>
                        <p>Sunday: 10:00 AM - 6:00 PM</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;