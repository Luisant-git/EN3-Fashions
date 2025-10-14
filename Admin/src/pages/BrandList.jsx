import React, { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'

const BrandList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const brands = [
    { id: 1, name: 'Nike', description: 'Sports and athletic wear', website: 'https://nike.com', status: 'active', createdAt: '2024-01-15' },
    { id: 2, name: 'Adidas', description: 'Sports equipment and clothing', website: 'https://adidas.com', status: 'active', createdAt: '2024-01-10' },
    { id: 3, name: 'Puma', description: 'Athletic and casual footwear', website: 'https://puma.com', status: 'inactive', createdAt: '2024-01-05' }
  ]

  const handleEdit = (id) => {
    console.log('Edit brand:', id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      console.log('Delete brand:', id)
    }
  }

  const columns = [
    { key: 'name', label: 'Brand Name' },
    { key: 'description', label: 'Description' },
    { key: 'website', label: 'Website' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`status ${value}`}>{value}</span>
      )
    },
    { key: 'createdAt', label: 'Created' },
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
    <div className="brand-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Brands</h1>
          <p>Manage your product brands</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-brand')}>
          <Plus size={20} />
          Add Brand
        </button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search brands..."
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
        data={brands}
        columns={columns}
        searchTerm={searchTerm}
        searchKey="name"
      />
    </div>
  )
}

export default BrandList