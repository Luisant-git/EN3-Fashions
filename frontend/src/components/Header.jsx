import React, { useState, useContext } from 'react';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import { AuthContext } from '../contexts/AuthContext';

const Header = ({ setView }) => {
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const { user, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleLogout = () => {
        logout();
        setView({ page: 'home' });
    }

    const handleProfileClick = () => {
        if (user) {
            setView({ page: 'profile' });
        } else {
            setView({ page: 'login' });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            setView({ page: 'search', query: searchQuery.trim() });
            setSearchQuery('');
        }
    };

    const handleMobileLinkClick = (view) => {
        setView(view);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="logo-container" onClick={() => setView({ page: 'home' })}>
                <img src="./EN3 TRENDS-LOGO.png" alt="EN3 Fashion Trends Logo" className="logo-icon" />
            </div>
            <div className="header-center">
                <nav className="navigation">
                    <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'category', title: 'New Arrivals', filter: { type: 'tag', value: 'new' } }); }}>New Arrivals</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'subcategory', title: "Men's Collection", tag: 'men' }); }}>Men's Wear</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'subcategory', title: "Boys' Collection", tag: 'boys' }); }}>Boys' Wear</a>
                    <a href="#" className="sale-link" onClick={(e) => { e.preventDefault(); setView({ page: 'category', title: 'Sale', filter: { type: 'tag', value: 'sale' } }); }}>Sale</a>
                </nav>
            </div>
            <div className="header-right">
                <form className="search-container" onSubmit={handleSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    <input 
                        type="text" 
                        placeholder="Search for products"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
                <div className="header-actions">
                    <div className="icon-wrapper" onClick={handleProfileClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </div>
                    <div className="icon-wrapper" onClick={() => setView({ page: 'wishlist' })}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                        {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                    </div>
                    <div className="icon-wrapper" onClick={() => setView({ page: 'cart' })}>
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.658-.463 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        {totalItems > 0 && <span className="badge">{totalItems}</span>}
                    </div>
                </div>
                 <button className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
                </button>
            </div>
             {isMobileMenuOpen && (
                <>
                    <div className="mobile-nav-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                        <button className="close-menu" onClick={() => setIsMobileMenuOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                        <nav>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick({ page: 'category', title: 'New Arrivals', filter: { type: 'tag', value: 'new' } }); }}>New Arrivals</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick({ page: 'subcategory', title: "Men's Collection", tag: 'men' }); }}>Men's Wear</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick({ page: 'subcategory', title: "Boys' Collection", tag: 'boys' }); }}>Boys' Wear</a>
                            <a href="#" className="sale-link" onClick={(e) => { e.preventDefault(); handleMobileLinkClick({ page: 'category', title: 'Sale', filter: { type: 'tag', value: 'sale' } }); }}>Sale</a>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;