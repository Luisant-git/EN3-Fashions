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
import { generateCategoryUrl } from '../utils/slugify';
import icon from '/icon.png';

const HomePage = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    

    
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
            <div className="whatsapp-float" onClick={() => setShowWhatsAppModal(true)}>
                <svg viewBox="0 0 32 32" fill="white" width="28" height="28">
                    <path d="M16 0C7.164 0 0 7.164 0 16c0 2.825.736 5.478 2.024 7.776L0 32l8.416-2.208A15.93 15.93 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm8.08 22.912c-.352.992-1.744 1.824-2.848 2.064-.752.16-1.728.288-5.024-.992-4.224-1.632-6.944-5.92-7.152-6.192-.208-.272-1.696-2.256-1.696-4.304s1.072-3.056 1.456-3.472c.384-.416.832-.512 1.12-.512.272 0 .544.016.784.016.256 0 .592-.096.928.704.352.832 1.184 2.88 1.28 3.088.096.208.16.448.032.72-.128.272-.192.448-.384.688-.192.24-.4.528-.576.704-.192.192-.384.4-.16.784.224.384.992 1.632 2.128 2.64 1.456 1.296 2.688 1.696 3.072 1.888.384.192.608.16.832-.096.224-.256.96-1.12 1.216-1.504.256-.384.512-.32.864-.192.352.128 2.24 1.056 2.624 1.248.384.192.64.288.736.448.096.16.096.928-.256 1.92z"/>
                </svg>
            </div>

            {showWhatsAppModal && (
                <div className="whatsapp-modal-overlay" onClick={() => setShowWhatsAppModal(false)}>
                    <div className="whatsapp-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="whatsapp-modal-header">
                            <div className="whatsapp-header-content">
                                <div className="whatsapp-icon-circle">
                                    <img src={icon} alt="EN3 Trends" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
                                </div>
                                <span>EN3 Trends</span>
                            </div>
                            <button className="whatsapp-close" onClick={() => setShowWhatsAppModal(false)}>×</button>
                        </div>
                        <div className="whatsapp-modal-body">
                            <div className="whatsapp-message">
                                <div className="whatsapp-avatar">
                                    <img src={icon} alt="EN3 Trends" style={{ width: '25px', height: '25px', objectFit: 'contain' }} />
                                </div>
                                <div className="whatsapp-bubble">
                                    <strong>EN3 Trends</strong>
                                    <p>Hello! 👋 I'm from EN3 Trends, How can I help you?</p>
                                    <span className="whatsapp-time">just now</span>
                                </div>
                            </div>
                        </div>
                        <div className="whatsapp-modal-footer">
                            <input type="text" placeholder="Type your message..." />
                            <button className="whatsapp-send-btn" onClick={() => window.open('https://wa.me/YOUR_PHONE_NUMBER', '_blank')}>
                                <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    {Array.isArray(categories) && categories.map((category) => (
                        <div key={category.id} className="category-card" onClick={() => navigate(generateCategoryUrl(category.name, category.id))}>
                            <p>{category.name}</p>
                            <img src={category.image} alt={category.name}/>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;