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
import { generateSubcategoryUrl } from '../utils/slugify';
import icon from '/icon.png';

const HomePage = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    

    
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
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
                setBanners(Array.isArray(bannersData) ? bannersData : []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleBannerClick = (link) => {
        console.log('Banner clicked with link:', link);
        if (link) {
            console.log('Opening link:', link);
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="home-page">
            <section style={{ position: 'relative', width: '100%', height: isMobile ? '400px' : '600px', overflow: 'hidden' }}>
                {Array.isArray(banners) && banners.map((banner, index) => {
                    const bannerImage = isMobile && banner.mobileImage ? banner.mobileImage : banner.image;
                    return (
                        <img
                            key={banner.id}
                            src={bannerImage}
                            alt={banner.title || 'Banner'}
                            onClick={() => banner.link && handleBannerClick(banner.link)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: index === currentSlide ? 1 : 0,
                                transition: 'opacity 1s ease-in-out',
                                cursor: banner.link ? 'pointer' : 'default'
                            }}
                        />
                    );
                })}
                {banners.length > 0 && banners[currentSlide]?.title && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 2, pointerEvents: 'none', textAlign: 'center', color: 'white' }}>
                        <h1 style={{ fontSize: isMobile ? '2rem' : '3.5rem', fontWeight: 700, margin: 0 }}>{banners[currentSlide].title}</h1>
                    </div>
                )}
                <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 3 }}>
                    {Array.isArray(banners) && banners.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                background: index === currentSlide ? 'white' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </div>
            </section>
            
            <section className="home-section">
                <h2>Shop by Category</h2>
                <div className="category-display">
                    {Array.isArray(categories) && categories.flatMap((category) => 
                        Array.isArray(category.subCategories) ? category.subCategories : []
                    ).map((subcategory) => (
                        <div key={subcategory.id} className="category-card" onClick={() => {
                            navigate(generateSubcategoryUrl(subcategory.name, subcategory.id));
                            window.scrollTo(0, 0);
                        }}>
                            <img src={subcategory.image} alt={subcategory.name}/>
                            <p>{subcategory.name}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;