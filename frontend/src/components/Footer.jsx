import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();
    
    return (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-column brand-info">
                <div className="logo-container" onClick={() => navigate('/')}>
                    <span className="logo-text">EN3 Fashions</span>
                </div>
                <p>Elevate your style with our curated collection of men's and boys' fashion.</p>
            </div>
            <div className="footer-column">
                <h4>Policy</h4>
                <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/return-policy'); window.scrollTo(0, 0); }}>Return Policy</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/shipping-policy'); window.scrollTo(0, 0); }}>Shipping Policy</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/privacy-policy'); }}>Privacy Policy</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/terms-of-service'); }}>Terms of Service</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Information</h4>
                <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/about'); }}>About Us</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); }}>Contact Us</a></li>
                    {/* <li><a href="#">FAQs</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('/returns-policy'); }}>Returns & Policies</a></li> */}
                </ul>
            </div>
            <div className="footer-column">
                <h4>Join Our Newsletter</h4>
                <p>Get exclusive offers and style updates straight to your inbox.</p>
                <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                    <input type="email" placeholder="Enter your email" />
                    <button type="submit">Subscribe</button>
                </form>
                 <div className="social-icons">
                    <a href="https://www.facebook.com/EN3Fashions" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.032A9.979 9.979 0 0 0 22 12z"/></svg></a>
                    {/* <a href="#" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.72-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.8 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.01-.06C3.91 19.44 6.08 20 8.5 20c7.3 0 11.29-6.06 11.29-11.29l-.01-.51c.78-.57 1.45-1.27 1.99-2.09z"/></svg></a> */}
                    <a href="https://www.instagram.com/en3fashions/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.25-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.441c-3.161 0-3.528.012-4.755.068-2.673.123-3.953 1.4-4.076 4.076-.056 1.227-.068 1.594-.068 4.755s.012 3.528.068 4.755c.123 2.673 1.403 3.953 4.076 4.076 1.227.056 1.594.068 4.755.068s3.528-.012 4.755-.068c2.673-.123 3.953-1.403 4.076-4.076.056-1.227.068-1.594.068-4.755s-.012-3.528-.068-4.755c-.123-2.673-1.403-3.953-4.076-4.076C15.528 3.615 15.161 3.604 12 3.604zm0 4.238c-2.404 0-4.356 1.952-4.356 4.356s1.952 4.356 4.356 4.356 4.356-1.952 4.356-4.356-1.952-4.356-4.356-4.356zm0 7.273c-1.608 0-2.917-1.308-2.917-2.917s1.309-2.917 2.917-2.917 2.917 1.308 2.917 2.917-1.309 2.917-2.917 2.917zm4.38-7.64c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z"/></svg></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>© 2025 EN3 Fashions. All rights reserved by KPG Apparels.</p>
        </div>
    </footer>
    );
};

export default Footer;