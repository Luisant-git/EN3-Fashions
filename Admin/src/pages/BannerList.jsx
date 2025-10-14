import React, { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, Image } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'

const BannerList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const banners = [
    { id: 1, title: 'Summer Sale 2024', position: 'Hero', status: 'active', startDate: '2024-01-15', endDate: '2024-02-15', clicks: 1250 },
    { id: 2, title: 'New Arrivals', position: 'Secondary', status: 'active', startDate: '2024-01-10', endDate: '2024-03-10', clicks: 890 },
    { id: 3, title: 'Flash Sale', position: 'Popup', status: 'inactive', startDate: '2024-01-05', endDate: '2024-01-20', clicks: 2100 },
    { id: 4, title: 'Brand Showcase', position: 'Footer', status: 'active', startDate: '2024-01-01', endDate: '2024-12-31', clicks: 450 }
  ]

  const handleEdit = (id) => {
    console.log('Edit banner:', id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      console.log('Delete banner:', id)
    }
  }

  const columns = [
    { 
      key: 'title', 
      label: 'Banner Title',
      render: (value, row) => (
        <div className="banner-info">
          <Image size={16} className="banner-icon" />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'position', label: 'Position' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`status ${value}`}>{value}</span>
      )
    },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { 
      key: 'clicks', 
      label: 'Clicks',
      render: (value) => <span className="click-count">{value.toLocaleString()}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button className="action-btn view" title="View">
            <Eye size={16} />
          </button>
          <button className="action-btn edit" onClick={() => handleEdit(row.id)} title="Edit">
            <Edit size={16} />
          </button>
          <button className="action-btn delete" onClick={() => handleDelete(row.id)} title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="banner-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Banners</h1>
          <p>Manage your website banners and promotions</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-banner')}>
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search banners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <button className="btn btn-outline">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      <DataTable 
        data={banners}
        columns={columns}
        searchTerm={searchTerm}
        searchKey="title"
      />
    </div>
  )
}

export default BannerList