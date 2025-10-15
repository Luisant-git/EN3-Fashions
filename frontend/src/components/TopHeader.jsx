import React, { useState, useEffect } from 'react';

const TopHeader = () => {
    const [currentText, setCurrentText] = useState(0);
    const texts = [
        "FREE SHIPPING on orders above ₹999",
        "30-Day Easy Returns",
        "24/7 Customer Support"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prev) => (prev + 1) % texts.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [texts.length]);

    return (
        <div className="top-header">
            <div className="top-header-content">
                <div className="desktop-header-items">
                    <div className="top-header-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM12 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5zM15.75 18.75a1.5 1.5 0 01-3 0V8.25a1.5 1.5 0 013 0v10.5z" />
                        </svg>
                        <span>FREE SHIPPING on orders above ₹999</span>
                    </div>
                    <div className="top-header-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m-4.991 4.99a8.25 8.25 0 01-8.25 8.25" />
                        </svg>
                        <span>30-Day Easy Returns</span>
                    </div>
                    <div className="top-header-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                        </svg>
                        <span>24/7 Customer Support</span>
                    </div>
                </div>
                <div className="mobile-text-slider">
                    <div className="marquee">
                        <span>{texts[currentText]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopHeader;