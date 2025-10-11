import React from 'react'
import { Eye, TrendingUp, Users, ShoppingCart, Package, Star } from 'lucide-react'

const Overview = () => {
  const quickStats = [
    { label: 'Total Views', value: '45,678', icon: Eye, color: 'blue' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'green' },
    { label: 'Active Users', value: '1,234', icon: Users, color: 'purple' },
    { label: 'Avg. Order Value', value: '₹2,456', icon: ShoppingCart, color: 'orange' }
  ]

  const recentActivity = [
    { type: 'order', message: 'New order #1234 received', time: '2 minutes ago' },
    { type: 'customer', message: 'New customer registration', time: '5 minutes ago' },
    { type: 'product', message: 'Product "Wireless Headphones" updated', time: '10 minutes ago' },
    { type: 'review', message: 'New 5-star review received', time: '15 minutes ago' },
    { type: 'stock', message: 'Low stock alert for "Cotton T-Shirt"', time: '20 minutes ago' }
  ]

  const topPerformers = [
    { name: 'Wireless Headphones', metric: '245 sales', status: 'trending' },
    { name: 'Cotton T-Shirt', metric: '189 sales', status: 'stable' },
    { name: 'Running Shoes', metric: '156 sales', status: 'trending' },
    { name: 'Smartphone Case', metric: '134 sales', status: 'declining' }
  ]

  return (
    <div className="overview">
      <div className="page-header">
        <h1>Overview</h1>
        <p>Quick snapshot of your business performance</p>
      </div>

      <div className="quick-stats">
        {quickStats.map((stat, index) => (
          <div key={index} className={`quick-stat-card ${stat.color}`}>
            <div className="stat-icon">
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="overview-grid">
        <div className="card">
          <div className="card-header">
            <h3>Recent Activity</h3>
          </div>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'order' && <ShoppingCart size={16} />}
                  {activity.type === 'customer' && <Users size={16} />}
                  {activity.type === 'product' && <Package size={16} />}
                  {activity.type === 'review' && <Star size={16} />}
                  {activity.type === 'stock' && <TrendingUp size={16} />}
                </div>
                <div className="activity-content">
                  <p>{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Top Performers</h3>
          </div>
          <div className="performers-list">
            {topPerformers.map((performer, index) => (
              <div key={index} className="performer-item">
                <div className="performer-info">
                  <h4>{performer.name}</h4>
                  <p>{performer.metric}</p>
                </div>
                <div className={`performer-status ${performer.status}`}>
                  {performer.status === 'trending' && <TrendingUp size={16} />}
                  {performer.status === 'stable' && <span className="stable-dot"></span>}
                  {performer.status === 'declining' && <TrendingUp size={16} className="declining" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="overview-summary">
        <div className="card">
          <div className="card-header">
            <h3>Business Summary</h3>
          </div>
          <div className="summary-grid">
            <div className="summary-item">
              <h4>Today's Performance</h4>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Orders</span>
                  <span className="stat-value">23</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Revenue</span>
                  <span className="stat-value">₹12,450</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Visitors</span>
                  <span className="stat-value">456</span>
                </div>
              </div>
            </div>
            <div className="summary-item">
              <h4>This Week</h4>
              <div className="summary-stats">
                <div className="summary-stat">
                  <span className="stat-label">Orders</span>
                  <span className="stat-value">156</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">Revenue</span>
                  <span className="stat-value">₹89,670</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-label">New Customers</span>
                  <span className="stat-value">34</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
