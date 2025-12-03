import React, { useEffect } from 'react';

const AboutUsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
    <div className="policy-page">
        <div className="container">
            <h1>About Us</h1>
            <div className="policy-content">
                <p>EN3 Fashions, owned and operated by KPG Apparels, is a clothing brand dedicated to offering stylish, comfortable, and affordable fashion for everyday wear. While EN3 Fashions represents our brand identity and the style we deliver, KPG Apparels is our registered legal business name under which all operations, billing, and compliance are maintained.</p>
                
                <section>
                    <h2>Who We Are</h2>
                    <p>At EN3 Fashions, we focus on curating modern, trendy apparel that suits the needs of today's fashion-forward customers. Our mission is to make quality fashion accessible, ensuring every product reflects comfort, durability, and style.</p>
                </section>
                
                <section>
                    <h2>What We Offer</h2>
                    <p>We bring you a range of clothing designed with attention to detail, quality fabrics, and contemporary appeal. Whether it's casual wear, daily essentials, or lifestyle fashion, we aim to provide collections that elevate your wardrobe effortlessly.</p>
                </section>
                
                <section>
                    <h2>Our Promise</h2>
                    <p>Quality you can trust</p>
                    <p>Affordable pricing</p>
                    <p>Customer-friendly service</p>
                    <p>Transparent and ethical business operations under KPG Apparels</p>
                </section>
                
                <section>
                    <h2>Brand & Legal Identity</h2>
                    <p>EN3 Fashions continues as our public-facing brand, while KPG Apparels remains the officially registered entity responsible for business operations, taxes, invoicing, and compliance. This structure allows us to maintain a strong brand presence while ensuring professional and legally compliant business management.</p>
                </section>
            </div>
        </div>
    </div>
    );
};

export default AboutUsPage;