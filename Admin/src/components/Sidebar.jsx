import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Users, Warehouse, Settings, ChevronDown, ChevronRight, BarChart3, Eye, Plus, List, Gift, Tag, Image, Percent, MapPin, Star, TrendingUp, UserPlus, Menu, X } from 'lucide-react'

const Sidebar = ({ collapsed, setCollapsed }) => {
  const [expandedItems, setExpandedItems] = useState({})
  const location = useLocation()

  const toggleExpanded = (key) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const menuItems = [
    {
      key: 'dashboards',
      icon: LayoutDashboard,
      label: 'Dashboards',
      children: [
        { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { key: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { key: 'overview', icon: Eye, label: 'Overview', path: '/overview' }
      ]
    },
    {
      key: 'master',
      icon: Package,
      label: 'Master',
      children: [
        { key: 'add-product', icon: Plus, label: 'Add Product', path: '/add-product' },
        { key: 'product-list', icon: List, label: 'Product List', path: '/product-list' },
        { key: 'combo-offers', icon: Gift, label: 'Combo Offers', path: '/combo-offers' },
        { key: 'add-brand', icon: Tag, label: 'Add Brand', path: '/add-brand' },
        { key: 'add-category', icon: Tag, label: 'Add Category', path: '/add-category' },
        { key: 'add-sub-category', icon: Tag, label: 'Add Sub Category', path: '/add-sub-category' },
        { key: 'add-banner', icon: Image, label: 'Add Banner', path: '/add-banner' },
        { key: 'add-coupon', icon: Percent, label: 'Add Coupon', path: '/add-coupon' },
        { key: 'add-pincode', icon: MapPin, label: 'Add Pincode', path: '/add-pincode' }
      ]
    },
    {
      key: 'orders',
      icon: ShoppingCart,
      label: 'Orders List',
      path: '/orders'
    },
    {
      key: 'customers',
      icon: Users,
      label: 'Customers',
      children: [
        { key: 'customer-list', icon: List, label: 'Customer List', path: '/customer-list' },
        { key: 'customer-reviews', icon: Star, label: 'Customer Reviews', path: '/customer-reviews' }
      ]
    },
    {
      key: 'inventory',
      icon: Warehouse,
      label: 'Inventory',
      children: [
        { key: 'all-stock-list', icon: List, label: 'All Stock List', path: '/all-stock-list' },
        { key: 'tracker-stocks', icon: TrendingUp, label: 'Tracker Stocks', path: '/tracker-stocks' }
      ]
    },
    {
      key: 'manage-user',
      icon: Settings,
      label: 'Manage User',
      children: [
        { key: 'employee-details', icon: Users, label: 'Employee Details', path: '/employee-details' },
        { key: 'add-employee', icon: UserPlus, label: 'Add Employee', path: '/add-employee' }
      ]
    }
  ]

  const renderMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedItems[item.key]
    const Icon = item.icon
    const isActive = location.pathname === item.path

    return (
      <div key={item.key} className="menu-item">
        {hasChildren ? (
          <div 
            className={`menu-item-header ${isActive ? 'active' : ''}`}
            onClick={() => toggleExpanded(item.key)}
          >
            <Icon size={20} />
            {!collapsed && (
              <>
                <span className="menu-label">{item.label}</span>
                <div className="expand-icon">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </>
            )}
          </div>
        ) : (
          <Link 
            to={item.path}
            className={`menu-item-header ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} />
            {!collapsed && <span className="menu-label">{item.label}</span>}
          </Link>
        )}
        
        {hasChildren && isExpanded && !collapsed && (
          <div className="submenu">
            {item.children.map(child => {
              const ChildIcon = child.icon
              const isChildActive = location.pathname === child.path
              return (
                <Link 
                  key={child.key}
                  to={child.path}
                  className={`submenu-item ${isChildActive ? 'active' : ''}`}
                >
                  <ChildIcon size={16} />
                  <span>{child.label}</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
   <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
  <div className="sidebar-header">
    <div 
      className="logo"
      onClick={() => setCollapsed(!collapsed)} // ✅ Toggle on logo click
      style={{ cursor: 'pointer' }} // Optional: show hand cursor
    >
      <div className="logo-icon">A</div>
      {!collapsed && <span className="logo-text">Admin Panel</span>}
    </div>
  </div>

      
      <nav className="sidebar-nav">
        {menuItems.map(renderMenuItem)}
      </nav>
    </div>
  )
}

export default Sidebar
