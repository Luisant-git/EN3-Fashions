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
        
        <di className="header-right">
          </di>

        <div className="header-right">
          
          <div className="profile-container">
            <div 
              className="user-profile"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="user-avatar">
                <span>A</span>
              </div>
              <div className="user-info">
                {/* <span className="user-name">En3 Fashion</span> */}
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
