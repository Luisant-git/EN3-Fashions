import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import { WishlistContext } from '../contexts/WishlistContext';
import { AuthContext } from '../contexts/AuthContext';
import { getCategories } from '../api/categoryApi';
import p1 from '/p1.png';
import p2 from '/p2.png';
import p3 from '/p3.png';
import p4 from '/p4.png';
import logo from '/EN3 TRENDS-LOGO.png';

const Header = () => {
    const navigate = useNavigate();
    const { cart } = useContext(CartContext);
    const { wishlist } = useContext(WishlistContext);
    const { user, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [searchRecommendations, setSearchRecommendations] = useState([]);
    const [desktopSearchRecommendations, setDesktopSearchRecommendations] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoriesData, productsData] = await Promise.all([
                    getCategories(),
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/products/active`).then(r => r.json())
                ]);
                setCategories(categoriesData);
                setNewArrivals(productsData.filter(p => p.newArrivals).slice(0, 4));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    const handleProfileClick = () => {
        if (user) {
            navigate('/profile');
        } else {
            navigate('/login');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim() !== '') {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSearchRecommendations([]);
        }
    };
    
    const handleSearchInput = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (query.trim() && isMobileSearchOpen) {
            const mockProducts = [
                { id: 1, name: 'Polo T-Shirt', price: '₹999', image: p1 },
                { id: 2, name: 'Round Neck T-Shirt', price: '₹799', image: p2 },
                { id: 3, name: 'Long Sleeve Shirt', price: '₹1299', image: p3 },
                { id: 4, name: 'Track Pants', price: '₹1199', image: p4 }
            ];
            
            const filtered = mockProducts.filter(product => 
                product.name.toLowerCase().includes(query.toLowerCase())
            );
            setSearchRecommendations(filtered.slice(0, 5));
        } else {
            setSearchRecommendations([]);
        }
    };

    const handleMobileLinkClick = (path) => {
        navigate(path);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="header">
            <div className="logo-container" onClick={() => navigate('/')}>
                <img src={logo} alt="EN3 Fashion Trends Logo" className="logo-icon" />
            </div>
            <div className="header-center">
                <nav className="navigation">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a>
                    <div className="nav-item">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/new-arrivals'); }}>New Arrivals</a>
                        {newArrivals.length > 0 && (
                            <div className="dropdown-menu products-dropdown">
                                {newArrivals.map((product) => {
                                    const firstColor = product.colors?.[0];
                                    const imageUrl = firstColor?.image || product.gallery?.[0]?.url;
                                    return (
                                        <a key={product.id} href="#" onClick={(e) => { e.preventDefault(); navigate(`/product/${product.id}`); }}>
                                            <img src={imageUrl} alt={product.name} />
                                            {product.name}
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    {categories.map((category) => (
                        <div key={category.id} className="nav-item">
                            <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/category/${category.id}`); }}>{category.name}</a>
                            {category.subCategories && category.subCategories.length > 0 && (
                                <div className="dropdown-menu">
                                    {category.subCategories.map((subcat) => (
                                        <a key={subcat.id} href="#" onClick={(e) => { e.preventDefault(); navigate(`/category/${category.id}/products?sub=${subcat.id}`); }}>
                                            <img src={subcat.image} alt={subcat.name} />
                                            {subcat.name}
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <a href="#" className="sale-link" onClick={(e) => { e.preventDefault(); navigate('/category/sale'); }}>Sale</a>
                </nav>
            </div>
            <div className="header-right">
                <form className="search-container" onSubmit={handleSearch}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    <input 
                        type="text" 
                        placeholder="Search for products"
                        value={searchQuery}
                        onChange={(e) => {
                            const query = e.target.value;
                            setSearchQuery(query);
                            
                            if (query.trim()) {
                                const mockProducts = [
                                    { id: 1, name: 'Polo T-Shirt', price: '₹999', image: p1 },
                                    { id: 2, name: 'Round Neck T-Shirt', price: '₹799', image: p2 },
                                    { id: 3, name: 'Long Sleeve Shirt', price: '₹1299', image: p3 },
                                    { id: 4, name: 'Track Pants', price: '₹1199', image: p4 }
                                ];
                                
                                const filtered = mockProducts.filter(product => 
                                    product.name.toLowerCase().includes(query.toLowerCase())
                                );
                                setDesktopSearchRecommendations(filtered.slice(0, 4));
                            } else {
                                setDesktopSearchRecommendations([]);
                            }
                        }}
                    />
                    {desktopSearchRecommendations.length > 0 && (
                        <div className="desktop-search-recommendations">
                            {desktopSearchRecommendations.map(product => (
                                <div key={product.id} className="desktop-search-recommendation" onClick={() => {
                                    navigate(`/product/${product.id}`);
                                    setSearchQuery('');
                                    setDesktopSearchRecommendations([]);
                                }}>
                                    <img src={product.image} alt={product.name} />
                                    <div className="desktop-search-recommendation-info">
                                        <p className="desktop-search-recommendation-name">{product.name}</p>
                                        <p className="desktop-search-recommendation-price">{product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </form>
                <div className="header-actions">
                    <div className="icon-wrapper" onClick={handleProfileClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                    </div>
                    <div className="icon-wrapper mobile-search-icon" style={{display: 'none'}} onClick={() => setIsMobileSearchOpen(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                    </div>
                    <div className="icon-wrapper" onClick={() => navigate('/wishlist')}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                        {wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
                    </div>
                    <div className="icon-wrapper" onClick={() => navigate('/cart')}>
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
                            <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick('/'); }}>Home</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick('/new-arrivals'); }}>New Arrivals</a>
                            {categories.map((category) => (
                                <a key={category.id} href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick(`/category/${category.id}`); }}>{category.name}</a>
                            ))}
                            <a href="#" className="sale-link" onClick={(e) => { e.preventDefault(); handleMobileLinkClick('/category/sale'); }}>Sale</a>
                            <a href="#" className="login-btn" onClick={(e) => { e.preventDefault(); handleMobileLinkClick(user ? '/profile' : '/login'); }}>{user ? 'Profile' : 'Login'}</a>
                        </nav>
                    </div>
                </>
            )}
            {isMobileSearchOpen && (
                <div className="mobile-search-page">
                    <div className="mobile-search-header">
                        <button className="back-btn" onClick={() => setIsMobileSearchOpen(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                        </button>
                        <form className="mobile-search-form" onSubmit={(e) => { handleSearch(e); setIsMobileSearchOpen(false); }}>
                            <input 
                                type="text" 
                                placeholder="Search for products"
                                value={searchQuery}
                                onChange={handleSearchInput}
                                autoFocus
                            />
                        </form>
                    </div>
                    {searchRecommendations.length > 0 && (
                        <div className="mobile-search-recommendations">
                            {searchRecommendations.map(product => (
                                <div key={product.id} className="search-recommendation" onClick={() => {
                                    navigate(`/product/${product.id}`);
                                    setIsMobileSearchOpen(false);
                                    setSearchQuery('');
                                    setSearchRecommendations([]);
                                }}>
                                    <img src={product.image} alt={product.name} />
                                    <div className="search-recommendation-info">
                                        <p className="search-recommendation-name">{product.name}</p>
                                        <p className="search-recommendation-price">{product.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;