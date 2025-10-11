import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Search, User, ChevronDown, Maximize2, Settings, LogOut } from 'lucide-react'

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    window.location.href = '/login'
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="search-input"
            />
          </div>
        </div>
        
        <div className="header-right">
          {/* <div className="stats-item">
            <span className="currency">₹</span>
            <span className="amount">38,535.41</span>
            <span className="country">IN</span>
          </div> */}
          
          <button className="icon-btn">
            <Maximize2 size={18} />
          </button>
          
          <div className="notification-container">
            <button 
              className="icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              <span className="notification-badge">3</span>
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <span className="notification-count">3 new</span>
                </div>
                <div className="notification-list">
                  <div className="notification-item">
                    <div className="notification-content">
                      <p>New order received</p>
                      <span className="notification-time">2 minutes ago</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-content">
                      <p>Low stock alert for Product A</p>
                      <span className="notification-time">1 hour ago</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <div className="notification-content">
                      <p>Customer review submitted</p>
                      <span className="notification-time">3 hours ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="profile-container">
            <div 
              className="user-profile"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="user-avatar">
                <span>S</span>
              </div>
              <div className="user-info">
                <span className="user-name">Saravana</span>
                <span className="user-role">Admin</span>
              </div>
              <ChevronDown size={16} />
            </div>
            
            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-item">
                  <User size={16} />
                  <span>Profile</span>
                </div>
                <div className="profile-item">
                  <Settings size={16} />
                  <span>Settings</span>
                </div>
                <div className="profile-item logout" onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
