import React, { useState, useEffect } from 'react';
import bg7 from '/bg7.png';
import bg9 from '/bg9.png';
import bg10 from '/bg10.png';
import m1 from '/m1.png';
import m2 from '/m2.png';
import bg3 from '/bg3.png';
import c5 from '/c5.png';
import c6 from '/c6.png';

const HomePage = ({ setView }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    const desktopImages = [bg7, bg9, bg10];
    const mobileImages = [m1, m2, bg3];
    const heroImages = isMobile ? mobileImages : desktopImages;
    
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                        <img src={c5} alt="Men's Wear"/>
                        <p>Men's Wear</p>
                    </div>
                    <div className="category-card" onClick={() => setView({ page: 'subcategory', title: "Boys' Collection", tag: 'boys' })}>
                        <img src={c6} alt="Kids Wear"/>
                        <p>Kids Wear</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;