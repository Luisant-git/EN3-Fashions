import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '/icon.png';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopHeader from './components/TopHeader';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import SubcategoryPage from './components/SubcategoryPage';
import NewArrivalsPage from './components/NewArrivalsPage';
import OfferPage from './components/OfferPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import WishlistPage from './components/WishlistPage';
import OrdersPage from './components/OrdersPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmationPage from './components/OrderConfirmationPage';
import SearchResultsPage from './components/SearchResultsPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ProfilePage from './components/ProfilePage';
import AboutUsPage from './components/AboutUsPage';
import ReturnsPolicyPage from './components/ReturnsPolicyPage';
import ReturnPolicy from './components/ReturnPolicy';
import ShippingPolicy from './components/ShippingPolicy';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ContactUs from './components/ContactUs';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

const App = () => {
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [whatsappMessage, setWhatsappMessage] = useState('');

    return (
        <AuthProvider>
            <CartProvider>
                <WishlistProvider>
                    <Router>
                        <div className="app-container">
                            <TopHeader />
                            <Header />
                            <main className="main-content">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                                    <Route path="/offers" element={<OfferPage />} />
                                    <Route path="/category/:categorySlug/:categoryId" element={<SubcategoryPage />} />
                                    <Route path="/category/:categorySlug/:categoryId/products" element={<CategoryPage />} />
                                    <Route path="/subcategory/:subcategorySlug/:subcategoryId" element={<CategoryPage />} />
                                    <Route path="/product/:productSlug/:productId" element={<ProductDetailPage />} />
                                    <Route path="/cart" element={<CartPage />} />
                                    <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                                    <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                                    <Route path="/checkout" element={<CheckoutPage />} />
                                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                                    <Route path="/search" element={<SearchResultsPage />} />
                                    <Route path="/login" element={<LoginPage />} />
                                    <Route path="/signup" element={<SignupPage />} />
                                    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                                    <Route path="/about" element={<AboutUsPage />} />
                                    <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
                                    <Route path="/return-policy" element={<ReturnPolicy />} />
                                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                    <Route path="/terms-of-service" element={<TermsOfService />} />
                                    <Route path="/contact" element={<ContactUs />} />
                                </Routes>
                            </main>
                            <Footer />
                            <ToastContainer position="top-right" autoClose={1000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
                            
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
                                            <input type="text" placeholder="Type your message..." value={whatsappMessage} onChange={(e) => setWhatsappMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && window.open(`https://wa.me/919597689888?text=${encodeURIComponent(whatsappMessage)}`, '_blank')} />
                                            <button className="whatsapp-send-btn" onClick={() => window.open(`https://wa.me/919597689888?text=${encodeURIComponent(whatsappMessage)}`, '_blank')}>
                                                <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                                                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Router>
                </WishlistProvider>
            </CartProvider>
        </AuthProvider>
    );
};

export default App;