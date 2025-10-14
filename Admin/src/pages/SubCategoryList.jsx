import React, { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'

const SubCategoryList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const subCategories = [
    { id: 1, name: 'Casual T-Shirts', category: 'T-Shirts', description: 'Everyday casual wear', status: 'active', productCount: 15, createdAt: '2024-01-15' },
    { id: 2, name: 'Formal T-Shirts', category: 'T-Shirts', description: 'Office and formal wear', status: 'active', productCount: 10, createdAt: '2024-01-12' },
    { id: 3, name: 'Slim Fit Trousers', category: 'Trousers', description: 'Modern slim fit pants', status: 'active', productCount: 12, createdAt: '2024-01-10' },
    { id: 4, name: 'Cargo Trousers', category: 'Trousers', description: 'Utility and casual pants', status: 'active', productCount: 6, createdAt: '2024-01-08' },
    { id: 5, name: 'Sports Tracks', category: 'Tracks', description: 'Athletic wear', status: 'inactive', productCount: 8, createdAt: '2024-01-05' }
  ]

  const handleEdit = (id) => {
    console.log('Edit subcategory:', id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      console.log('Delete subcategory:', id)
    }
  }

  const columns = [
    { key: 'name', label: 'Subcategory Name' },
    { key: 'category', label: 'Parent Category' },
    { key: 'description', label: 'Description' },
    { 
      key: 'productCount', 
      label: 'Products',
      render: (value) => <span className="product-count">{value}</span>
    },
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
    <div className="subcategory-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Sub Categories</h1>
          <p>Manage your product subcategories</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-sub-category')}>
          <Plus size={20} />
          Add Sub Category
        </button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search subcategories..."
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
        data={subCategories}
        columns={columns}
        searchTerm={searchTerm}
        searchKey="name"
      />
    </div>
  )
}

export default SubCategoryList