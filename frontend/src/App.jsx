import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TopHeader from './components/TopHeader';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import SubcategoryPage from './components/SubcategoryPage';
import NewArrivalsPage from './components/NewArrivalsPage';
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

    return (
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    <Router>
                        <div className="app-container">
                            <TopHeader />
                            <Header />
                            <main className="main-content">
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/new-arrivals" element={<NewArrivalsPage />} />
                                    <Route path="/category/:categoryName" element={<SubcategoryPage />} />
                                    <Route path="/category/:categoryName/products" element={<CategoryPage />} />
                                    <Route path="/product/:productId" element={<ProductDetailPage />} />
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
                        </div>
                    </Router>
                </CartProvider>
            </WishlistProvider>
        </AuthProvider>
    );
};

export default App;