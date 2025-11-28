import React, { useState, useEffect } from 'react'
import { TrendingUp, Users, ShoppingCart, Package, Star, IndianRupee } from 'lucide-react'
import { getQuickStats, getRecentActivity, getTopPerformers } from '../api/overviewApi'

const Overview = () => {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [recentActivity, setRecentActivity] = useState([])
  const [topPerformers, setTopPerformers] = useState([])
  useEffect(() => {
    fetchOverviewData()
  }, [])

  const fetchOverviewData = async () => {
    try {
      const [statsData, activityData, performersData] = await Promise.all([
        getQuickStats(),
        getRecentActivity(),
        getTopPerformers()
      ])
      setStats(statsData)
      setRecentActivity(activityData)
      setTopPerformers(performersData)
    } catch (error) {
      console.error('Error fetching overview data:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickStats = stats ? [
    { label: 'Total Revenues', value: stats.totalRevenue.toLocaleString(), icon: IndianRupee, color: 'blue' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), icon: TrendingUp, color: 'green' },
    { label: 'Total Users', value: stats.totalUsers.toString(), icon: Users, color: 'purple' },
    { label: 'Avg. Order Value', value: `₹${stats.avgOrderValue.toLocaleString()}`, icon: ShoppingCart, color: 'orange' }
  ] : []

  if (loading) {
    return <div className="overview"><div className="page-header"><h1>Loading...</h1></div></div>
  }

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
    </div>
  )
}

export default Overview
