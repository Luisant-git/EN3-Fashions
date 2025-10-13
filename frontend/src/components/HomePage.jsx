import React, { useState, useEffect } from 'react';

const HomePage = ({ setView }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const heroImages = [
        '/bg7.png',
        '/bg9.png',
        '/bg10.png'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-slider">
                    {heroImages.map((image, index) => (
                        <div 
                            key={index}
                            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${image})` }}
                        />
                    ))}
                </div>
                <div className="hero-content">
                    <h1>Elevate Your Style</h1>
                    <p>Discover the latest trends in men's and boys' fashion, shop now and redefine your wardrobe.</p>
                    <button onClick={() => setView({ page: 'category', title: 'New Arrivals', filter: { type: 'tag', value: 'new' } })}>Shop Now</button>
                </div>
                <div className="hero-dots">
                    {heroImages.map((_, index) => (
                        <div 
                            key={index}
                            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </section>
            
            <section className="home-section">
                <h2>Shop by Category</h2>
                <div className="category-display">
                    <div className="category-card" onClick={() => setView({ page: 'subcategory', title: "Men's Collection", tag: 'men' })}>
                        <img src="/c5.png" alt="Men's Wear"/>
                        <p>Men's Wear</p>
                    </div>
                    <div className="category-card" onClick={() => setView({ page: 'subcategory', title: "Boys' Collection", tag: 'boys' })}>
                        <img src="/c6.png" alt="Kids Wear"/>
                        <p>Kids Wear</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;