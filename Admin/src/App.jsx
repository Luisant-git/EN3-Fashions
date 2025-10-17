import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Analytics from './pages/Analytics'
import Overview from './pages/Overview'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import ProductList from './pages/ProductList'
import ComboOffers from './pages/ComboOffers'
import AddBrand from './pages/AddBrand'
import AddCategory from './pages/AddCategory'
import AddSubCategory from './pages/AddSubCategory'
import AddBanner from './pages/AddBanner'
import AddCoupon from './pages/AddCoupon'
import AddPincode from './pages/AddPincode'
import OrdersList from './pages/OrdersList'
import CustomerList from './pages/CustomerList'
import CustomerReviews from './pages/CustomerReviews'
import AllStockList from './pages/AllStockList'
import TrackerStocks from './pages/TrackerStocks'
import EmployeeDetails from './pages/EmployeeDetails'
import AddEmployee from './pages/AddEmployee'
import AddTemplate from './pages/AddTemplate'
import Login from './pages/Login'
import BrandList from './pages/BrandList'
import CategoryList from './pages/CategoryList'
import SubCategoryList from './pages/SubCategoryList'
import BannerList from './pages/BannerList'
import CouponList from './pages/CouponList'
import PincodeList from './pages/PincodeList'
import CreateCombo from './pages/CreateCombo'

// Import all SCSS files
import './styles/base.scss'
import './styles/components/buttons.scss'
import './styles/components/cards.scss'
import './styles/components/forms.scss'
import './styles/components/sidebar.scss'
import './styles/components/header.scss'
import './styles/components/data-table.scss'
import './styles/pages/dashboard.scss'
import './styles/pages/analytics.scss'
import './styles/pages/overview.scss'
import './styles/pages/orders.scss'
import './styles/pages/customers.scss'
import './styles/pages/reviews.scss'
import './styles/pages/stock.scss'
import './styles/pages/products.scss'
import './styles/pages/add-template.scss'
import './styles/pages/login.scss'
import './styles/pages/list-pages.scss'
import './styles/pages/create-combo.scss'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true'
  })

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true')
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <div className="app">
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
          <Header />
          <div className="content-area">
            <Routes>
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/edit-product/:id" element={<EditProduct />} />
              <Route path="/product-list" element={<ProductList />} />
              {/* <Route path="/combo-offers" element={<ComboOffers />} /> */}
              <Route path="/add-brand" element={<AddBrand />} />
              <Route path="/add-category" element={<AddCategory />} />
              <Route path="/add-sub-category" element={<AddSubCategory />} />
              <Route path="/add-banner" element={<AddBanner />} />
              <Route path="/add-coupon" element={<AddCoupon />} />
              <Route path="/add-pincode" element={<AddPincode />} />
              <Route path="/orders" element={<OrdersList />} />
              <Route path="/customer-list" element={<CustomerList />} />
              <Route path="/customer-reviews" element={<CustomerReviews />} />
              <Route path="/all-stock-list" element={<AllStockList />} />
              <Route path="/tracker-stocks" element={<TrackerStocks />} />
              <Route path="/employee-details" element={<EmployeeDetails />} />
              <Route path="/add-employee" element={<AddEmployee />} />
              <Route path="/add-template" element={<AddTemplate />} />
              <Route path="/brand-list" element={<BrandList />} />
              <Route path="/category-list" element={<CategoryList />} />
              <Route path="/subcategory-list" element={<SubCategoryList />} />
              <Route path="/banner-list" element={<BannerList />} />
              <Route path="/coupon-list" element={<CouponList />} />
              <Route path="/pincode-list" element={<PincodeList />} />
              <Route path="/create-combo" element={<CreateCombo />} />
            </Routes>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  )
}

export default App
