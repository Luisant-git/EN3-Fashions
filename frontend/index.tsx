import React, { useState, useContext, createContext, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

// --- MOCK DATA ---
const PRODUCTS = [
    { id: 1, name: 'Classic Crew Neck T-Shirt', category: 'T-Shirts', price: 499, imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/m/e/i/-original-imah4qhe6t66ydgt.jpeg?q=70', altImageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/m/e/i/-original-imah4qhe6t66ydgt.jpeg?q=70', sizes: ['S', 'M', 'L', 'XL'], colors: ['Black', 'White', 'Grey'], tags: ['men', 'new'], galleryImages: ['https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png', 'https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001_1280.png', 'https://cdn.pixabay.com/photo/2017/08/01/11/48/blue-2564660_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg'] },
    { id: 2, name: 'Graphic Print T-Shirt', category: 'T-Shirts', price: 599, imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/shopsy-t-shirt/h/w/4/m-urm026541p-urgear-original-imahckspvhzvzvza.jpeg?q=70', altImageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/9/n/w/xxl-urm025601p-urgear-original-imahe3fpwpvxedrp.jpeg?q=70', sizes: ['M', 'L', 'XL'], colors: ['Red', 'Blue', 'Green'], tags: ['men', 'boys'], galleryImages: ['https://cdn.pixabay.com/photo/2017/08/01/11/48/blue-2564660_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg'] },
    { id: 3, name: 'Slim Fit Chinos', category: 'Trousers', price: 1299, imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/trouser/2/c/c/32-kctr-dmy-2121-olive-fubar-original-imahyex5gahhabjs.jpeg?q=70', altImageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/trouser/e/p/7/32-kctr-dmy-2121-olive-fubar-original-imahyex5e2787sgc.jpeg?q=70', sizes: ['30', '32', '34', '36'], colors: ['Khaki', 'Navy', 'Olive'], tags: ['men'], galleryImages: ['https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg'] },
    { id: 4, name: 'Performance Joggers', category: 'Tracks', price: 1099, imageUrl: 'https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg', altImageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg', sizes: ['S', 'M', 'L'], colors: ['Black', 'Charcoal'], tags: ['men', 'sale'], galleryImages: ['https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg'] },
    { id: 5, name: 'V-Neck T-Shirt', category: 'T-Shirts', price: 499, imageUrl: 'https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001_1280.png', altImageUrl: 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png', sizes: ['S', 'M', 'L', 'XL'], colors: ['White', 'Navy'], tags: ['men'], galleryImages: ['https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001_1280.png', 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png'] },
    { id: 6, name: 'Cargo Trousers', category: 'Trousers', price: 1499, imageUrl: 'https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg', altImageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg', sizes: ['30', '32', '34'], colors: ['Olive', 'Beige'], tags: ['men'], galleryImages: ['https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg'] },
    { id: 7, name: 'Tapered Fit Tracks', category: 'Tracks', price: 999, imageUrl: 'https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg', altImageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg', sizes: ['S', 'M', 'L'], colors: ['Grey', 'Navy'], tags: ['men', 'boys'], galleryImages: ['https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg'] },
    { id: 8, name: 'Polo T-Shirt', category: 'T-Shirts', price: 799, imageUrl: 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png', altImageUrl: 'https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001_1280.png', sizes: ['M', 'L', 'XL'], colors: ['Black', 'White', 'Maroon'], tags: ['men', 'boys'], galleryImages: ['https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png', 'https://cdn.pixabay.com/photo/2016/12/06/09/30/blank-1886001_1280.png', 'https://cdn.pixabay.com/photo/2017/08/01/11/48/blue-2564660_1280.jpg'] },
    { id: 11, name: 'Boys Pullover Hoodie', category: 'Tracks', price: 899, imageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sweatshirt/4/v/1/7-8-years-peb9773-bumzee-original-imah3yn5yqc3hyfp.jpeg?q=70', altImageUrl: 'https://rukminim2.flixcart.com/image/612/612/xif0q/sweatshirt/4/v/1/7-8-years-peb9773-bumzee-original-imah3yn5yqc3hyfp.jpeg?q=70', sizes: ['S', 'M', 'L'], colors: ['Grey', 'Black'], tags: ['boys', 'new'], galleryImages: ['https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg'] },
    { id: 12, name: 'Faded Denim Shirt', category: 'T-Shirts', price: 999, imageUrl: 'https://cdn.pixabay.com/photo/2017/08/01/11/48/blue-2564660_1280.jpg', altImageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg', sizes: ['M', 'L', 'XL'], colors: ['Blue'], tags: ['men', 'sale'], galleryImages: ['https://cdn.pixabay.com/photo/2017/08/01/11/48/blue-2564660_1280.jpg', 'https://cdn.pixabay.com/photo/2016/11/29/13/14/attractive-1869761_1280.jpg'] }
];
const FEATURED_ITEMS = [
    { id: 101, name: 'Casual Shirt', price: 499, imageUrl: 'https://cdn.pixabay.com/photo/2016/12/06/09/31/blank-1886008_1280.png' },
    { id: 102, name: 'Denim Jeans', price: 799, imageUrl: 'https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2564660_1280.jpg' },
    { id: 103, name: 'Sports Shoes', price: 999, imageUrl: 'https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_1280.jpg' },
];
const CATEGORIES = ['T-Shirts', 'Tracks', 'Trousers'];
const SIZES = ['S', 'M', 'L', 'XL', '30', '32', '34', '36'];
const COLORS = ['Black', 'White', 'Grey', 'Red', 'Blue', 'Green', 'Khaki', 'Navy', 'Olive', 'Charcoal', 'Beige', 'Maroon'];

// --- HELPERS ---
const getBundlePrice = (qty) => {
    const singlePrice = 499;
    if (qty === 1) return singlePrice;
    if (qty === 2) return 799;
    if (qty >= 3) return Math.floor(qty / 3) * 999 + getBundlePrice(qty % 3);
    return 0; // Should not happen for qty > 0
};

// --- CONTEXTS ---
const CartContext = createContext(null);
const WishlistContext = createContext(null);
const AuthContext = createContext(null);

const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    const addToCart = (product, size, color) => {
        setLoading(true);
        setTimeout(() => {
            setCart(prevCart => {
                const existing = prevCart.find(item => item.id === product.id && item.size === size && item.color === color);
                if (existing) {
                    return prevCart.map(item => item.id === product.id && item.size === size && item.color === color ? { ...item, quantity: item.quantity + 1 } : item);
                }
                return [...prevCart, { ...product, quantity: 1, size, color }];
            });
            setLoading(false);
        }, 500);
    };

    const removeFromCart = (productId, size, color) => {
        setCart(prevCart => prevCart.filter(item => !(item.id === productId && item.size === size && item.color === color)));
    };

    const updateQuantity = (productId, size, color, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId, size, color);
        } else {
            setCart(prevCart => prevCart.map(item => item.id === productId && item.size === size && item.color === color ? { ...item, quantity: newQuantity } : item));
        }
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, loading }}>
            {children}
        </CartContext.Provider>
    );
};

const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const [loadingProductId, setLoadingProductId] = useState(null);

    const toggleWishlist = (product) => {
        setLoadingProductId(product.id);
        setTimeout(() => {
            setWishlist(prev => {
                const exists = prev.some(item => item.id === product.id);
                if (exists) {
                    return prev.filter(item => item.id !== product.id);
                }
                return [...prev, product];
            });
            setLoadingProductId(null);
        }, 500);
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    return (
        <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loadingProductId }}>
            {children}
        </WishlistContext.Provider>
    );
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = (email, password) => {
        setLoading(true);
        return new Promise(resolve => {
            setTimeout(() => {
                if (email && password) {
                    setUser({ name: 'Test User', email: email });
                    resolve(true);
                } else {
                    resolve(false);
                }
                setLoading(false);
            }, 1000);
        });
    };

    const signup = (name, email, password) => {
        setLoading(true);
        return new Promise(resolve => {
            setTimeout(() => {
                if (name && email && password) {
                    setUser({ name, email });
                    resolve(true);
                } else {
                    resolve(false);
                }
                setLoading(false);
            }, 1000);
        });
    };
    
    const logout = () => {
        setLoading(true);
        setTimeout(() => {
            setUser(null);
            setLoading(false);
        }, 500);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// --- COMPONENTS ---
const LoadingSpinner = () => <div className="loading-spinner"></div>;

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
                {/* <span className="logo-text">EN3 Fashion</span> */}
            </div>
            <div className="header-center">
                <nav className="navigation">
                    <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'category', title: 'New Arrivals', filter: { type: 'tag', value: 'new' } }); }}>New Arrivals</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'subcategory', title: "Men's Collection", tag: 'men' }); }}>Men’s Wear</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'subcategory', title: "Boys' Collection", tag: 'boys' }); }}>Boys’ Wear</a>
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
                            <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick({ page: 'subcategory', title: "Men's Collection", tag: 'men' }); }}>Men’s Wear</a>
                            <a href="#" onClick={(e) => { e.preventDefault(); handleMobileLinkClick({ page: 'subcategory', title: "Boys' Collection", tag: 'boys' }); }}>Boys’ Wear</a>
                            <a href="#" className="sale-link" onClick={(e) => { e.preventDefault(); handleMobileLinkClick({ page: 'category', title: 'Sale', filter: { type: 'tag', value: 'sale' } }); }}>Sale</a>
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
};

const Footer = ({ setView }) => (
    <footer className="footer">
        <div className="footer-content">
            <div className="footer-column brand-info">
                <div className="logo-container" onClick={() => setView({ page: 'home' })}>
                    {/* <img src="./EN3 LOGO PNG.png" alt="EN3 Fashion Trends Logo" className="logo-icon" /> */}
                    <span className="logo-text">EN3 Fashion</span>
                </div>
                <p>Elevate your style with our curated collection of men's and boys' fashion.</p>
            </div>
            <div className="footer-column">
                <h4>Shop</h4>
                <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'subcategory', title: "Men's Collection", tag: 'men' }); }}>Men's Wear</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'subcategory', title: "Boys' Collection", tag: 'boys' }); }}>Boys' Wear</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'category', title: 'Sale', filter: { type: 'tag', value: 'sale' } }); }}>Sale</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'category', title: 'New Arrivals', filter: { type: 'tag', value: 'new' } }); }}>New Arrivals</a></li>
                </ul>
            </div>
            <div className="footer-column">
                <h4>Information</h4>
                <ul>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'about' }); }}>About Us</a></li>
                    <li><a href="#">Contact Us</a></li>
                    <li><a href="#">FAQs</a></li>
                    <li><a href="#" onClick={(e) => { e.preventDefault(); setView({ page: 'returnsPolicy' }); }}>Returns & Policies</a></li>
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
                    <a href="#" aria-label="Facebook"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.032A9.979 9.979 0 0 0 22 12z"/></svg></a>
                    <a href="#" aria-label="Twitter"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98-3.56-.18-6.72-1.89-8.84-4.48-.37.63-.58 1.37-.58 2.15 0 1.49.76 2.8 1.91 3.56-.71 0-1.37-.22-1.95-.55v.05c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.01-.06C3.91 19.44 6.08 20 8.5 20c7.3 0 11.29-6.06 11.29-11.29l-.01-.51c.78-.57 1.45-1.27 1.99-2.09z"/></svg></a>
                    <a href="#" aria-label="Instagram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.25-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.85s.012-3.584.07-4.85c.149-3.227 1.664-4.771 4.919-4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.441c-3.161 0-3.528.012-4.755.068-2.673.123-3.953 1.4-4.076 4.076-.056 1.227-.068 1.594-.068 4.755s.012 3.528.068 4.755c.123 2.673 1.403 3.953 4.076 4.076 1.227.056 1.594.068 4.755.068s3.528-.012 4.755-.068c2.673-.123 3.953-1.403 4.076-4.076.056-1.227.068-1.594.068-4.755s-.012-3.528-.068-4.755c-.123-2.673-1.403-3.953-4.076-4.076C15.528 3.615 15.161 3.604 12 3.604zm0 4.238c-2.404 0-4.356 1.952-4.356 4.356s1.952 4.356 4.356 4.356 4.356-1.952 4.356-4.356-1.952-4.356-4.356-4.356zm0 7.273c-1.608 0-2.917-1.308-2.917-2.917s1.309-2.917 2.917-2.917 2.917 1.308 2.917 2.917-1.309 2.917-2.917 2.917zm4.38-7.64c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25z"/></svg></a>
                </div>
            </div>
        </div>
        <div className="footer-bottom">
            <p>© 2024 EN3 Fashion Trends. All rights reserved.</p>
        </div>
    </footer>
);

const ProductCard = ({ product, setView }) => {
    const [hover, setHover] = useState(false);
    const { toggleWishlist, isInWishlist, loadingProductId } = useContext(WishlistContext);
    
    return (
        <div className="product-card">
            <div className="product-image-container" 
                 onMouseEnter={() => setHover(true)} 
                 onMouseLeave={() => setHover(false)}
                 onClick={() => setView({ page: 'product', productId: product.id })}>
                <img src={hover ? product.altImageUrl : product.imageUrl} alt={product.name} />
                <div className="bundle-tag">Bundle Available</div>
                 <button 
                    className={`wishlist-toggle ${isInWishlist(product.id) ? 'active' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                    disabled={loadingProductId === product.id}
                    >
                    {loadingProductId === product.id ? <LoadingSpinner /> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>}
                </button>
            </div>
            <div className="product-info" onClick={() => setView({ page: 'product', productId: product.id })}>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-price">₹{product.price}</p>
            </div>
        </div>
    );
};

const SubcategoryPage = ({ title, tag, setView }) => {
    const subcategories = [
        { name: 'Polo T-Shirts', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/g/k/n/m-64518810-try-this-original-imahev3vmv63z92z.jpeg?q=70' },
        { name: 'Round Neck T-Shirts', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/m/e/i/-original-imah4qhe6t66ydgt.jpeg?q=70' },
        { name: 'Long Sleeve T-Shirts', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/9/n/w/xxl-urm025601p-urgear-original-imahe3fpwpvxedrp.jpeg?q=70' },
        { name: 'Track Pants', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/track-pant/u/v/y/xxl-nr22-conway-original-imahgya8hupaym5b.jpeg?q=70' },
        { name: 'Trousers', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/trouser/2/c/c/32-kctr-dmy-2121-olive-fubar-original-imahyex5gahhabjs.jpeg?q=70' },
        { name: 'Shorts', image: 'https://rukminim2.flixcart.com/image/612/612/xif0q/track-pant/t/1/e/32-gryjgr0506emenlwrs-dockstreet-original-imahc7vwcjse9geu.jpeg?q=70' }
    ];

    return (
        <div className="subcategory-page">
            <h1 className="subcategory-title">{title}</h1>
            <div className="subcategory-grid">
                {subcategories.map((subcat, index) => (
                    <div key={index} className="subcategory-card" onClick={() => setView({ page: 'category', title: subcat.name, filter: { type: 'tag', value: tag } })}>
                        <img src={subcat.image} alt={subcat.name} />
                        <p>{subcat.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HomePage = ({ setView }) => (
    <div className="home-page">
        <section className="hero-section">
            <div className="hero-content">
                <h1>Elevate Your Style</h1>
                <p>Discover the latest trends in men's and boys' fashion, shop now and redefine your wardrobe.</p>
                <button onClick={() => setView({ page: 'category', title: 'New Arrivals', filter: { type: 'tag', value: 'new' } })}>Shop Now</button>
            </div>
        </section>
        
        <section className="home-section">
            <h2>Shop by Category</h2>
            <div className="category-display">
                <div className="category-card" onClick={() => setView({ page: 'subcategory', title: "Men's Collection", tag: 'men' })}>
                    <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/t-shirt/g/k/n/m-64518810-try-this-original-imahev3vmv63z92z.jpeg?q=70" alt="Men's Wear"/>
                    <p>Men's Wear</p>
                </div>
                <div className="category-card" onClick={() => setView({ page: 'subcategory', title: "Boys' Collection", tag: 'boys' })}>
                    <img src="https://rukminim2.flixcart.com/image/612/612/xif0q/sweatshirt/4/v/1/7-8-years-peb9773-bumzee-original-imah3yn5yqc3hyfp.jpeg?q=70" alt="Kids Wear"/>
                    <p>Kids Wear</p>
                </div>
            </div>
        </section>
        
        {/* <section className="home-bundle-offer">
            <div className="bundle-image">
                <img src="https://image.hm.com/assets/hm/25/d6/25d6724a4e4191a8a42167628a72c586c980fca3.jpg?imwidth=820" alt="Folded sweaters" />
            </div>
            <div className="bundle-content">
                <h2>Pick Any 3<br/>for &#8377;999</h2>
                <p>Mix and match your favorite styles from our curated collection. Create your perfect bundle today!</p>
                <button onClick={() => setView({ page: 'category', title: "Men's Collection", filter: { type: 'tag', value: 'men' } })}>Shop Bundle</button>
            </div>
        </section> */}
        
        {/* <section className="home-section">
            <h2>Featured Items</h2>
            <div className="featured-items-grid">
                {FEATURED_ITEMS.map(item => (
                     <div key={item.id} className="featured-item-card">
                         <img src={item.imageUrl} alt={item.name} />
                         <div className="featured-item-info">
                            <p className="featured-item-name">{item.name}</p>
                            <p className="featured-item-price">₹{item.price}</p>
                         </div>
                    </div>
                ))}
            </div>
        </section> */}
    </div>
);

const FiltersComponent = ({ filters, setFilters, availableSizes, availableColors }) => {
    const handleFilterChange = (type, value) => {
        setFilters(prev => ({...prev, [type]: value}));
    };
    
    const handleMultiSelect = (type, value) => {
        setFilters(prev => {
            const current = new Set(prev[type] || []);
            if (current.has(value)) {
                current.delete(value);
            } else {
                current.add(value);
            }
            return {...prev, [type]: Array.from(current)};
        });
    };

    const resetFilters = () => {
        setFilters({});
    }

    return (
        <div className="filters-container">
            <h3>Filters</h3>
            <div className="filter-group">
                <h4>Price</h4>
                <div className="price-inputs">
                    <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => handleFilterChange('minPrice', e.target.value)} className={filters.minPrice ? 'active-filter' : ''}/>
                    <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} className={filters.maxPrice ? 'active-filter' : ''}/>
                </div>
            </div>
             <div className="filter-group">
                <h4>Size</h4>
                <div className="size-selector">
                    {availableSizes.map((size: string) => (
                         <button 
                            key={size}
                            onClick={() => handleMultiSelect('sizes', size)}
                            className={`size-option ${filters.sizes?.includes(size) ? 'active' : ''} ${filters.sizes?.includes(size) ? 'active-filter' : ''}`}
                         >{size}</button>
                    ))}
                </div>
            </div>
            <div className="filter-group">
                <h4>Color</h4>
                <div className="color-selector">
                    {availableColors.map((color: string) => (
                         <button 
                            key={color}
                            onClick={() => handleMultiSelect('colors', color)}
                            className={`color-option ${filters.colors?.includes(color) ? 'active' : ''} ${filters.colors?.includes(color) ? 'active-filter' : ''}`}
                         ><span style={{backgroundColor: color.toLowerCase()}}></span> {color}</button>
                    ))}
                </div>
            </div>
            <button onClick={resetFilters} className="reset-filters-btn">Reset Filters</button>
        </div>
    );
};

type FiltersState = {
    minPrice?: string;
    maxPrice?: string;
    sizes?: string[];
    colors?: string[];
};

const CategoryPage = ({ title, filter, setView }) => {
    const [filters, setFilters] = useState<FiltersState>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [gridLoading, setGridLoading] = useState(false);
    const firstRender = useRef(true);

    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isFilterOpen]);
    
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        setGridLoading(true);
        const timer = setTimeout(() => {
            setGridLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [filters]);


    const initialProducts = PRODUCTS.filter(p => {
        if (filter.type === 'category') {
            return p.category === filter.value;
        }
        if (filter.type === 'tag') {
            return p.tags.includes(filter.value);
        }
        return false;
    });

    const availableSizes = Array.from(new Set(initialProducts.flatMap(p => p.sizes))).sort();
    const availableColors = Array.from(new Set(initialProducts.flatMap(p => p.colors)));

    const filteredProducts = initialProducts.filter(p => {
        const { minPrice, maxPrice, sizes, colors } = filters;
        if (minPrice && p.price < Number(minPrice)) return false;
        if (maxPrice && p.price > Number(maxPrice)) return false;
        if (sizes && sizes.length > 0 && !p.sizes.some(s => sizes.includes(s))) return false;
        if (colors && colors.length > 0 && !p.colors.some(c => colors.includes(c))) return false;
        return true;
    });

    return (
        <div className="category-page">
            <h1 className="category-title">{title}</h1>
            <button className="mobile-filter-trigger" onClick={() => setIsFilterOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                <span>Filters</span>
            </button>
            <div className="category-content">
                 <div className="desktop-filters">
                    <FiltersComponent filters={filters} setFilters={setFilters} availableSizes={availableSizes} availableColors={availableColors} />
                 </div>
                 {isFilterOpen && (
                    <div className="filter-overlay">
                        <div className="filter-backdrop" onClick={() => setIsFilterOpen(false)}></div>
                        <div className="mobile-filters">
                            <div className="mobile-filters-header">
                                <h2>Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)}>&times;</button>
                            </div>
                            <div className="mobile-filters-content">
                                <FiltersComponent filters={filters} setFilters={setFilters} availableSizes={availableSizes} availableColors={availableColors} />
                            </div>
                        </div>
                    </div>
                )}
                <div className="product-grid-container">
                    {gridLoading && <div className="loading-overlay"><LoadingSpinner /></div>}
                    <div className="product-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => <ProductCard key={product.id} product={product} setView={setView} />)
                        ) : (
                            <p className="no-results-message">No products found matching your criteria.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SearchResultsPage = ({ query, setView }) => {
    const [filters, setFilters] = useState<FiltersState>({});
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [gridLoading, setGridLoading] = useState(false);
    const firstRender = useRef(true);

    useEffect(() => {
        if (isFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isFilterOpen]);
    
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        setGridLoading(true);
        const timer = setTimeout(() => {
            setGridLoading(false);
        }, 400);
        return () => clearTimeout(timer);
    }, [filters]);


    const initialProducts = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    const availableSizes = Array.from(new Set(initialProducts.flatMap(p => p.sizes))).sort();
    const availableColors = Array.from(new Set(initialProducts.flatMap(p => p.colors)));

    const filteredProducts = initialProducts.filter(p => {
        const { minPrice, maxPrice, sizes, colors } = filters;
        if (minPrice && p.price < Number(minPrice)) return false;
        if (maxPrice && p.price > Number(maxPrice)) return false;
        if (sizes && sizes.length > 0 && !p.sizes.some(s => sizes.includes(s))) return false;
        if (colors && colors.length > 0 && !p.colors.some(c => colors.includes(c))) return false;
        return true;
    });

    if (initialProducts.length === 0) {
        return (
            <div className="category-page">
                <h1 className="category-title">Search Results</h1>
                <p className="no-results-message">No products found for "{query}".</p>
            </div>
        )
    }

    return (
        <div className="category-page">
            <h1 className="category-title">Search Results for "{query}"</h1>
            <button className="mobile-filter-trigger" onClick={() => setIsFilterOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
                <span>Filters</span>
            </button>
            <div className="category-content">
                <div className="desktop-filters">
                    <FiltersComponent filters={filters} setFilters={setFilters} availableSizes={availableSizes} availableColors={availableColors} />
                </div>
                 {isFilterOpen && (
                    <div className="filter-overlay">
                        <div className="filter-backdrop" onClick={() => setIsFilterOpen(false)}></div>
                        <div className="mobile-filters">
                            <div className="mobile-filters-header">
                                <h2>Filters</h2>
                                <button onClick={() => setIsFilterOpen(false)}>&times;</button>
                            </div>
                            <div className="mobile-filters-content">
                                <FiltersComponent filters={filters} setFilters={setFilters} availableSizes={availableSizes} availableColors={availableColors} />
                            </div>
                        </div>
                    </div>
                )}
                 <div className="product-grid-container">
                    {gridLoading && <div className="loading-overlay"><LoadingSpinner /></div>}
                    <div className="product-grid">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => <ProductCard key={product.id} product={product} setView={setView} />)
                        ) : (
                            <p className="no-results-message">No products found matching your filter criteria.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductDetailPage = ({ productId, setView }) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const { addToCart, loading: cartLoading } = useContext(CartContext);
    const { toggleWishlist, isInWishlist, loadingProductId: wishlistLoadingId } = useContext(WishlistContext);
    
    const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [activeImage, setActiveImage] = useState(product.imageUrl);
    const [openAccordion, setOpenAccordion] = useState(1);
    
    if (!product) return <div>Product not found!</div>;

    const images = product.galleryImages || [product.imageUrl, product.altImageUrl];

    const handleAddToCart = () => {
        if (cartLoading) return;
        addToCart(product, selectedSize, selectedColor);
    };

    const accordionItems = [
        { id: 1, title: 'Product Description', content: 'This is a high-quality garment made from premium materials, designed for comfort and style. Perfect for any occasion, it features a modern fit and durable construction.' },
        { id: 2, title: 'Shipping & Returns', content: 'We offer free standard shipping on all orders over ₹1000. Express shipping options are available at checkout. Returns are accepted within 30 days of purchase for a full refund.' }
    ];

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    return (
        <div className="product-detail-page">
            <div className="pdp-image-section">
                <div className="pdp-image-gallery">
                    <div className="pdp-main-image">
                        <img src={activeImage} alt={product.name} />
                    </div>
                    <div className="pdp-thumbnails">
                        {images.map((img, index) => (
                            <div 
                                key={index} 
                                className={`pdp-thumbnail ${img === activeImage ? 'active' : ''}`}
                                onClick={() => setActiveImage(img)}
                            >
                                <img src={img} alt={`${product.name} thumbnail ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="pdp-details-section">
                <h1>{product.name}</h1>
                <p className="pdp-price">₹{product.price}</p>

                <div className="pdp-selector-group">
                    <label className="pdp-selector-label">Color: <strong>{selectedColor}</strong></label>
                    <div className="pdp-color-options">
                        {product.colors.map(color => (
                            <button 
                                key={color}
                                className={`pdp-color-btn ${selectedColor === color ? 'active' : ''}`}
                                style={{ backgroundColor: color.toLowerCase() }}
                                onClick={() => setSelectedColor(color)}
                                aria-label={`Select color ${color}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="pdp-selector-group">
                    <label className="pdp-selector-label">Size:</label>
                    <div className="pdp-size-options">
                        {product.sizes.map(size => (
                            <button 
                                key={size}
                                className={`pdp-size-btn ${selectedSize === size ? 'active' : ''}`}
                                onClick={() => setSelectedSize(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pdp-actions">
                    <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={cartLoading}>
                        {cartLoading ? <LoadingSpinner /> : 'Add to Cart'}
                    </button>
                    <button 
                        className={`wishlist-action-btn ${isInWishlist(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product)}
                        disabled={wishlistLoadingId === product.id}
                    >
                        {wishlistLoadingId === product.id ? <LoadingSpinner /> : (isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist')}
                    </button>
                </div>
                
                <div className="bundle-promo-card">
                    <h3>Bundle Offer!</h3>
                    <p>Pick any 2 for <strong>₹799</strong></p>
                    <p>Pick any 3 for <strong>₹999</strong></p>
                </div>

                <div className="pdp-accordion">
                    {accordionItems.map(item => (
                        <div key={item.id} className="accordion-item">
                            <button className="accordion-header" onClick={() => toggleAccordion(item.id)}>
                                <span>{item.title}</span>
                                <span className="accordion-icon">{openAccordion === item.id ? '-' : '+'}</span>
                            </button>
                            <div className={`accordion-content ${openAccordion === item.id ? 'open' : ''}`}>
                                <p>{item.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const CartPage = ({ setView }) => {
    const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

    const bundleEligibleItems = cart.filter(item => item.price === 499);
    const nonBundleItems = cart.filter(item => item.price !== 499);

    const bundleQty = bundleEligibleItems.reduce((sum, item) => sum + item.quantity, 0);
    const bundleTotal = getBundlePrice(bundleQty);
    const bundleOriginalTotal = bundleQty * 499;

    const nonBundleTotal = nonBundleItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const subtotal = bundleTotal + nonBundleTotal;
    const totalSavings = bundleOriginalTotal - bundleTotal;

    const [deliveryOption, setDeliveryOption] = useState({ fee: 50, name: 'Standard Delivery' });
    const deliveryOptions = [
        { fee: 50, name: 'Standard Delivery', duration: '3-5 days' },
        { fee: 150, name: 'Express Delivery', duration: '1-2 days' },
        { fee: 250, name: 'Next Day Delivery', duration: 'Tomorrow' },
    ];
    const finalTotal = subtotal + deliveryOption.fee;
    
    if (cart.length === 0) {
        return <div className="cart-page empty-cart"><h2>Your Cart is Empty</h2><button onClick={() => setView({ page: 'home' })}>Continue Shopping</button></div>;
    }

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            <div className="cart-content">
                <div className="cart-items">
                    {cart.map(item => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
                            <img src={item.imageUrl} alt={item.name} />
                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                <p>Size: {item.size}, Color: {item.color}</p>
                                <p>Price: ₹{item.price}</p>
                                <div className="quantity-control">
                                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}>+</button>
                                </div>
                            </div>
                            <button className="remove-item" onClick={() => removeFromCart(item.id, item.size, item.color)}>Remove</button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    {totalSavings > 0 && (
                        <div className="summary-row savings">
                            <span>Bundle Savings</span>
                            <span>- ₹{totalSavings.toFixed(2)}</span>
                        </div>
                    )}
                    <div className="delivery-options">
                        <h3>Delivery Options</h3>
                        {deliveryOptions.map(opt => (
                            <div key={opt.name} className={`delivery-option-card ${deliveryOption.name === opt.name ? 'selected' : ''}`} onClick={() => setDeliveryOption(opt)}>
                                <div>
                                    <strong>{opt.name}</strong> ({opt.duration})
                                </div>
                                <span>₹{opt.fee}</span>
                            </div>
                        ))}
                    </div>
                     <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryOption.fee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                    <button className="checkout-btn" onClick={() => setView({ page: 'checkout', deliveryOption })}>Proceed to Checkout</button>
                </div>
            </div>
        </div>
    );
};

const WishlistPage = ({ setView }) => {
    const { wishlist } = useContext(WishlistContext);

    if (wishlist.length === 0) {
        return <div className="wishlist-page empty-wishlist"><h2>Your Wishlist is Empty</h2><p>Add items you love to your wishlist to save them for later.</p><button onClick={() => setView({ page: 'home' })}>Discover Products</button></div>;
    }

    return (
        <div className="wishlist-page">
            <h1>My Wishlist</h1>
            <div className="product-grid">
                {wishlist.map(product => <ProductCard key={product.id} product={product} setView={setView} />)}
            </div>
        </div>
    );
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    
    useEffect(() => {
        const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        setOrders(savedOrders);
    }, []);

    if (orders.length === 0) {
        return <div className="orders-page empty-orders"><h2>No Past Orders</h2><p>You haven't placed any orders yet.</p></div>;
    }

    return (
        <div className="orders-page">
            <h1>My Orders</h1>
            <div className="orders-list">
                {orders.map((order, index) => (
                    <div key={index} className="order-card">
                        <div className="order-header">
                            <h3>Order #{order.id.slice(0, 8)}</h3>
                            <span>Date: {new Date(order.date).toLocaleDateString()}</span>
                            <strong>Total: ₹{order.total.toFixed(2)}</strong>
                        </div>
                        <div className="order-details">
                             <p><strong>Delivery:</strong> {order.deliveryOption.name} (+₹{order.deliveryOption.fee})</p>
                            {order.items.map(item => (
                                <div key={item.id} className="order-item">
                                    <img src={item.imageUrl} alt={item.name}/>
                                    <div>
                                        <p>{item.name}</p>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CheckoutPage = ({ setView, deliveryOption }) => {
    const { cart, clearCart } = useContext(CartContext);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = subtotal + deliveryOption.fee;

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        if (isPlacingOrder) return;

        setIsPlacingOrder(true);
        setTimeout(() => {
            const newOrder = {
                id: `STYLO-${Date.now()}`,
                date: new Date().toISOString(),
                items: cart,
                total: finalTotal,
                deliveryOption: deliveryOption
            };
            const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
            localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
            clearCart();
            setView({ page: 'orderConfirmation', order: newOrder });
            setIsPlacingOrder(false);
        }, 1500);
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>
            <div className="checkout-content">
                <div className="checkout-form">
                    <form onSubmit={handlePlaceOrder}>
                        <section>
                            <h2>Shipping Address</h2>
                            <input type="text" placeholder="Full Name" required />
                            <input type="text" placeholder="Address Line 1" required />
                            <input type="text" placeholder="Address Line 2" />
                            <div className="form-row">
                                <input type="text" placeholder="City" required />
                                <input type="text" placeholder="Pincode" required />
                            </div>
                             <input type="tel" placeholder="Mobile Number" required />
                        </section>
                        <section>
                            <h2>Payment Method</h2>
                            <div className="payment-methods">
                                <div className={`payment-method-card ${paymentMethod === 'card' ? 'selected' : ''}`} onClick={() => setPaymentMethod('card')}>
                                    <h4>Credit/Debit Card</h4>
                                </div>
                                <div className={`payment-method-card ${paymentMethod === 'upi' ? 'selected' : ''}`} onClick={() => setPaymentMethod('upi')}>
                                    <h4>UPI / Wallets</h4>
                                    <p className="upi-icons">GPay, PhonePe, Paytm</p>
                                </div>
                            </div>
                             {paymentMethod === 'card' && (
                                <div className="card-details">
                                    <input type="text" placeholder="Card Number" />
                                    <div className="form-row">
                                        <input type="text" placeholder="MM/YY" />
                                        <input type="text" placeholder="CVC" />
                                    </div>
                                </div>
                            )}
                        </section>
                        <button type="submit" className="confirm-pay-btn" disabled={isPlacingOrder}>
                            {isPlacingOrder ? <LoadingSpinner /> : 'Confirm & Pay'}
                        </button>
                    </form>
                </div>
                <div className="checkout-summary">
                    <h2>Order Summary</h2>
                    {cart.map(item => (
                         <div key={item.id} className="summary-item">
                             <span>{item.name} x {item.quantity}</span>
                             <span>₹{item.price * item.quantity}</span>
                         </div>
                    ))}
                    <hr/>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery Fee</span>
                        <span>₹{deliveryOption.fee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{finalTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderConfirmationPage = ({ order, setView }) => {
    return (
        <div className="order-confirmation-page">
            <div className="confirmation-box">
                <div className="confirmation-header">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <h1>Thank you for your order!</h1>
                    <p>Your order has been placed successfully.</p>
                </div>
                <div className="confirmation-summary">
                    <h3>Order Summary</h3>
                    <p><strong>Order ID:</strong> #{order.id.slice(0, 8)}</p>
                    {order.items.map(item => (
                        <div key={item.id} className="summary-item">
                            <span>{item.name} x {item.quantity}</span>
                            <span>₹{item.price * item.quantity}</span>
                        </div>
                    ))}
                    <hr/>
                    <div className="summary-row">
                        <span>Delivery</span>
                        <span>₹{order.deliveryOption.fee.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total Paid</span>
                        <span>₹{order.total.toFixed(2)}</span>
                    </div>
                </div>
                <button onClick={() => setView({ page: 'home' })} className="continue-shopping-btn">Continue Shopping</button>
            </div>
        </div>
    );
};

const LoginPage = ({ setView }) => {
    const { login, loading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(email, password);
        if (success) {
            setView({ page: 'home' });
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };
    
    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Login'}
                    </button>
                </form>
                <p>Don't have an account? <a href="#" onClick={(e) => {e.preventDefault(); setView({ page: 'signup' });}}>Sign Up</a></p>
            </div>
        </div>
    );
};

const SignupPage = ({ setView }) => {
    const { signup, loading } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup(name, email, password);
        setView({ page: 'home' });
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required/>
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required/>
                    <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required/>
                    <button type="submit" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Sign Up'}
                    </button>
                </form>
                <p>Already have an account? <a href="#" onClick={(e) => {e.preventDefault(); setView({ page: 'login' });}}>Login</a></p>
            </div>
        </div>
    );
};

const AboutUsPage = () => (
    <div className="static-page-container">
        <h1>About EN3 Fashion Trends</h1>
        <p>Welcome to EN3 Fashion Trends, your ultimate destination for contemporary men's and boys' fashion. Founded in 2024, our mission is to provide high-quality, stylish, and affordable clothing that empowers you to express your unique personality.</p>
        <p>At EN3 Fashion Trends, we believe that fashion is more than just clothes—it's a form of self-expression. That's why we meticulously curate our collections to bring you the latest trends and timeless classics. From our signature crew neck tees to our performance joggers, every piece is designed with comfort, durability, and style in mind.</p>
        <p>Our innovative bundle offers, like the "Pick Any 3 for ₹999," are designed to provide exceptional value, making it easier than ever to refresh your wardrobe without breaking the bank. We're committed to creating a seamless shopping experience, from our user-friendly website to our dedicated customer support.</p>
        <p>Thank you for choosing EN3 Fashion Trends. We're excited to be a part of your style journey.</p>
    </div>
);

const ReturnsPolicyPage = () => (
    <div className="static-page-container">
        <h1>Returns & Policies</h1>

        <h2>Return Policy</h2>
        <p>We want you to be completely satisfied with your purchase. If you are not happy with your order for any reason, you can return it within 30 days of the delivery date for a full refund or exchange. To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging with all tags attached.</p>
        <p>To initiate a return, please visit our online returns portal or contact our customer support team with your order number.</p>

        <h2>Exchange Policy</h2>
        <p>If you need to exchange an item for a different size or color, please follow the return process for the original item and place a new order for the desired item. This ensures you get your new item as quickly as possible.</p>

        <h2>Refunds</h2>
        <p>Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund. If you are approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7-10 business days.</p>

        <h2>Privacy Policy</h2>
        <p>Your privacy is important to us. This section outlines the types of personal information we collect and how we use, disclose, and protect that information. We collect information you provide directly to us, such as when you create an account, place an order, or contact customer service. We use this information to process your transactions, communicate with you, and improve our services. We do not sell your personal information to third parties.</p>

        <h2>Terms of Service</h2>
        <p>By accessing or using the EN3 Fashion Trends website, you agree to be bound by our Terms of Service. These terms govern your use of our website and the purchase of products from us. Please read these terms carefully before using our services. We reserve the right to update or modify these terms at any time without prior notice.</p>
    </div>
);

const ProfilePage = ({ setView }) => {
    const { user, logout, loading } = useContext(AuthContext);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [addressLoading, setAddressLoading] = useState(false);

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setPasswordLoading(true);
        setTimeout(() => {
            alert('Password changed successfully! (mock)');
            e.target.reset();
            setPasswordLoading(false);
        }, 1000);
    };

    const handleAddressUpdate = (e) => {
        e.preventDefault();
        setAddressLoading(true);
        setTimeout(() => {
            alert('Shipping address updated! (mock)');
            setAddressLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        logout();
        setView({ page: 'home' });
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>My Account</h1>
                    <button onClick={handleLogout} className="logout-btn" disabled={loading}>
                        {loading ? <LoadingSpinner /> : 'Logout'}
                    </button>
                </div>

                <div className="profile-section user-info">
                    <h2>Profile Information</h2>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <button onClick={() => setView({ page: 'orders' })} className="view-orders-btn">View My Orders</button>
                </div>

                <div className="profile-section">
                    <h2>Change Password</h2>
                    <form className="profile-form" onSubmit={handlePasswordChange}>
                        <input type="password" placeholder="Current Password" required />
                        <input type="password" placeholder="New Password" required />
                        <input type="password" placeholder="Confirm New Password" required />
                        <button type="submit" disabled={passwordLoading}>
                            {passwordLoading ? <LoadingSpinner /> : 'Update Password'}
                        </button>
                    </form>
                </div>

                <div className="profile-section">
                    <h2>Shipping Address</h2>
                    <form className="profile-form" onSubmit={handleAddressUpdate}>
                        <input type="text" placeholder="Full Name" defaultValue={user.name} required />
                        <input type="text" placeholder="Address Line 1" required />
                        <div className="form-row">
                           <input type="text" placeholder="City" required />
                           <input type="text" placeholder="Pincode" required />
                        </div>
                        <input type="tel" placeholder="Mobile Number" required />
                        <button type="submit" disabled={addressLoading}>
                            {addressLoading ? <LoadingSpinner /> : 'Save Address'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};


const ProtectedRoute = ({ children, setView }) => {
    const { user } = useContext(AuthContext);
    if (!user) {
        useEffect(() => {
            setView({ page: 'login' });
        }, []);
        return null;
    }
    return children;
};

type DeliveryOption = {
    fee: number;
    name: string;
    duration?: string;
};

type Order = {
    id: string;
    date: string;
    items: any[];
    total: number;
    deliveryOption: DeliveryOption;
};

type ViewState =
  | { page: 'home' }
  | { page: 'category'; title: string; filter: { type: 'category' | 'tag'; value: string } }
  | { page: 'subcategory'; title: string; tag: string }
  | { page: 'product'; productId: number }
  | { page: 'cart' }
  | { page: 'wishlist' }
  | { page: 'orders' }
  | { page: 'checkout'; deliveryOption: DeliveryOption }
  | { page: 'orderConfirmation'; order: Order }
  | { page: 'login' }
  | { page: 'signup' }
  | { page: 'about' }
  | { page: 'returnsPolicy' }
  | { page: 'profile' }
  | { page: 'search'; query: string };

const App = () => {
    const [view, setView] = useState<ViewState>({ page: 'home' });

    useEffect(() => {
        // Prevent scrolling when mobile menu is open
        if (document.body) {
            document.body.style.overflow = 'auto'; // Reset on view change
        }
    }, [view]);

    const renderView = () => {
        switch (view.page) {
            case 'home':
                return <HomePage setView={setView} />;
            case 'category':
                return <CategoryPage title={view.title} filter={view.filter} setView={setView} />;
            case 'subcategory':
                return <SubcategoryPage title={view.title} tag={view.tag} setView={setView} />;
            case 'product':
                return <ProductDetailPage productId={view.productId} setView={setView} />;
            case 'cart':
                return <CartPage setView={setView} />;
            case 'wishlist':
                return <ProtectedRoute setView={setView}><WishlistPage setView={setView} /></ProtectedRoute>;
            case 'orders':
                return <ProtectedRoute setView={setView}><OrdersPage /></ProtectedRoute>;
            case 'checkout':
                return <CheckoutPage setView={setView} deliveryOption={view.deliveryOption} />;
            case 'orderConfirmation':
                return <OrderConfirmationPage order={view.order} setView={setView} />;
            case 'login':
                return <LoginPage setView={setView} />;
            case 'signup':
                return <SignupPage setView={setView} />;
            case 'about':
                return <AboutUsPage />;
            case 'returnsPolicy':
                return <ReturnsPolicyPage />;
            case 'profile':
                return <ProtectedRoute setView={setView}><ProfilePage setView={setView} /></ProtectedRoute>;
            case 'search':
                return <SearchResultsPage query={view.query} setView={setView} />;
            default:
                return <HomePage setView={setView} />;
        }
    };

    return (
        <AuthProvider>
        <WishlistProvider>
        <CartProvider>
            <div className="app-container">
                <Header setView={setView} />
                <main className="main-content">
                    {renderView()}
                </main>
                <Footer setView={setView} />
            </div>
        </CartProvider>
        </WishlistProvider>
        </AuthProvider>
    );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);