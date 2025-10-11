import React from 'react';
import {
  Search,
  Calendar,
  Bell,
  UserCircle,
  Wallet,
  ShoppingCart,
  Users,
  Truck,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

// Import child components
import SalesAnalytics from '../components/SalesAnalytics';
import SalesTarget from '../components/SalesTarget';
import TopSellingProducts from '../components/TopSellingProducts';
import './Dashboard.scss'

// You can create a separate component for this, but for simplicity, it's here
const StatsCard = ({ title, value, period, change, trend, icon: Icon }) => {
  const isUp = trend === 'up';
  return (
    <div className="stats-card">
      <div className="stats-card__header">
        <div className="stats-card__info">
          <p className="stats-card__title">{title}</p>
          <p className="stats-card__period">{period}</p>
        </div>
        <div className="stats-card__icon">
          <Icon size={24} />
        </div>
      </div>
      <div className="stats-card__body">
        <h3 className="stats-card__value">{value}</h3>
        <div className={`stats-card__change ${isUp ? 'up' : 'down'}`}>
          {isUp ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const statsData = [
    {
      title: 'Total Revenue',
      period: 'Last 30 days',
      value: '$82,650',
      change: '11%',
      trend: 'up',
      icon: Wallet
    },
    {
      title: 'Total Order',
      period: 'Last 30 days',
      value: '1645',
      change: '11%',
      trend: 'up',
      icon: ShoppingCart
    },
    {
      title: 'Total Customer',
      period: 'Last 30 days',
      value: '1,462',
      change: '17%',
      trend: 'down',
      icon: Users
    },
    {
      title: 'Pending Delivery',
      period: 'Last 30 days',
      value: '117',
      change: '5%',
      trend: 'up',
      icon: Truck
    }
  ];

  const offers = [
    {
      title: '40% Discount Offer',
      status: 'Expire on: 05-08-24',
      progress: 75,
      type: 'discount'
    },
    {
      title: '100 Taka Cupon',
      status: 'Expire on: 10-09-24',
      progress: 60,
      type: 'coupon'
    },
    {
      title: 'Stock Out Sell',
      status: 'Upcoming on: 14-09-24',
      progress: 90,
      type: 'sellout'
    }
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="header-title">Overview</h1>
        <div className="header-actions">
          <div className="search-bar">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="Search..." />
          </div>
          <button className="icon-btn date-btn">
            <Calendar size={20} />
            <span>30 May</span>
          </button>
          <button className="icon-btn">
            <Bell size={20} />
          </button>
          <button className="icon-btn">
            <UserCircle size={24} />
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="dashboard-grid">
        {/* Stats Cards */}
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}

        {/* Sales Analytics */}
        <div className="card sales-analytics">
          <SalesAnalytics />
        </div>

        {/* Sales Target */}
        <div className="card sales-target">
          <SalesTarget />
        </div>

        {/* Top Selling Products */}
        <div className="card top-products">
          <div className="card-header">
            <h3>Top Selling Products</h3>
            <div className="nav-arrows">
              <button><ArrowLeft size={16} /></button>
              <button><ArrowRight size={16} /></button>
            </div>
          </div>
          <TopSellingProducts />
        </div>

        {/* Current Offer */}
        <div className="card current-offers">
          <div className="card-header">
            <h3>Current Offer</h3>
          </div>
          <div className="offers-list">
            {offers.map((offer, index) => (
              <div key={index} className="offer-item">
                <p className="offer-title">{offer.title}</p>
                <p className="offer-status">{offer.status}</p>
                <div className="offer-progress-bar">
                  <div 
                    className={`progress ${offer.type}`}
                    style={{ width: `${offer.progress}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;