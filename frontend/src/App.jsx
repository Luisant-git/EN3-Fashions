import React, { useState, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import CategoryPage from './components/CategoryPage';
import SubcategoryPage from './components/SubcategoryPage';
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
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

const App = () => {
    const [view, setView] = useState({ page: 'home' });

    useEffect(() => {
        if (document.body) {
            document.body.style.overflow = 'auto';
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
            case 'search':
                return <SearchResultsPage query={view.query} setView={setView} />;
            case 'login':
                return <LoginPage setView={setView} />;
            case 'signup':
                return <SignupPage setView={setView} />;
            case 'profile':
                return <ProtectedRoute setView={setView}><ProfilePage setView={setView} /></ProtectedRoute>;
            case 'about':
                return <AboutUsPage />;
            case 'returnsPolicy':
                return <ReturnsPolicyPage />;
            default:
                return <HomePage setView={setView} />;
        }
    };

    return (
        <AuthProvider>
            <WishlistProvider>
                <CartProvider>
                    <div className="app-container">
                        <TopHeader />
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

export default App;