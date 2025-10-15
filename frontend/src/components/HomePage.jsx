import React, { useState, useEffect } from 'react';
import bg7 from '/bg7.png';
import bg9 from '/bg9.png';
import bg10 from '/bg10.png';
import m1 from '/m1.png';
import m2 from '/m2.png';
import bg3 from '/bg3.png';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../api/categoryApi';
import { getActiveBanners } from '../api/bannerApi';

const HomePage = () => {
    const navigate = useNavigate();
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
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        if (banners.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % banners.length);
            }, 4000);
            return () => clearInterval(interval);
        }
    }, [banners.length]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, bannersData] = await Promise.all([
                    getCategories(),
                    getActiveBanners()
                ]);
                setCategories(categoriesData);
                setBanners(bannersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleBannerClick = (link, event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('Banner clicked, link:', link);
        
        if (link) {
            // Try multiple approaches for better compatibility
            try {
                window.open(link, '_blank', 'noopener,noreferrer');
            } catch (error) {
                console.error('Failed to open link:', error);
                // Fallback to location.href
                window.location.href = link;
            }
        }
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-slider">
                    {banners.map((banner, index) => (
                        <div 
                            key={banner.id}
                            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            style={{ backgroundImage: `url(${banner.image})`, cursor: 'pointer', zIndex: 1 }}
                            onClick={(e) => handleBannerClick(banner.link, e)}
                            title={banner.title}
                        />
                    ))}
                </div>
                {banners.length > 0 && (
                    <div style={{ cursor: 'pointer' }} className="hero-content">
                        <h1>{banners[currentSlide]?.title || 'Elevate Your Style'}</h1>
                        <p>Discover the latest trends in men's and boys' fashion, shop now and redefine your wardrobe.</p>
                        <button onClick={() => navigate('/category/new-arrivals')}>Shop Now</button>
                    </div>
                )}
                <div className="hero-dots">
                    {banners.map((_, index) => (
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
                    {categories.map((category) => (
                        <div key={category.id} className="category-card" onClick={() => navigate(`/subcategory/${category.name.toLowerCase()}`)}>
                            <img src={category.image} alt={category.name}/>
                            <p>{category.name}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;