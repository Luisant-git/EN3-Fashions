import React, { useState, useEffect } from 'react';
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
import TopSellingProducts from '../components/TopSellingProducts';
import { getDashboardStats, getSalesAnalytics, getTopProducts, getCurrentOffers } from '../api/dashboardApi';
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
  const [statsData, setStatsData] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const productsScrollRef = React.useRef(null);

  const scrollProducts = (direction) => {
    if (productsScrollRef.current) {
      const scrollAmount = 300;
      productsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [stats, offersData] = await Promise.all([
        getDashboardStats(),
        getCurrentOffers()
      ]);

      setStatsData([
        {
          title: 'Total Revenue',
          period: 'Last 30 days',
          value: stats.totalRevenue.value,
          change: stats.totalRevenue.change,
          trend: stats.totalRevenue.trend,
          icon: Wallet
        },
        {
          title: 'Total Order',
          period: 'Last 30 days',
          value: stats.totalOrder.value,
          change: stats.totalOrder.change,
          trend: stats.totalOrder.trend,
          icon: ShoppingCart
        },
        {
          title: 'Total Customer',
          period: 'Last 30 days',
          value: stats.totalCustomer.value,
          change: stats.totalCustomer.change,
          trend: stats.totalCustomer.trend,
          icon: Users
        },
        {
          title: 'Pending Delivery',
          period: 'Last 30 days',
          value: stats.pendingDelivery.value,
          change: stats.pendingDelivery.change,
          trend: stats.pendingDelivery.trend,
          icon: Truck
        }
      ]);

      setOffers(offersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const todayDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

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
            <span>{todayDate}</span>
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
        {statsData.length > 0 && statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}

        {/* Sales Analytics */}
        <div className="card sales-analytics">
          <SalesAnalytics />
        </div>

        {/* Top Selling Products */}
        <div className="card top-products">
          <div className="card-header">
            <h3>Top Selling Products</h3>
            <div className="nav-arrows">
              <button onClick={() => scrollProducts('left')}><ArrowLeft size={16} /></button>
              <button onClick={() => scrollProducts('right')}><ArrowRight size={16} /></button>
            </div>
          </div>
          <TopSellingProducts scrollRef={productsScrollRef} />
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