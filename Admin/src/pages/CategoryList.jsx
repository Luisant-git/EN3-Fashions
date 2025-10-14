import React, { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'

const CategoryList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 1, name: 'T-Shirts', description: 'Casual and formal t-shirts', status: 'active', productCount: 25, createdAt: '2024-01-15' },
    { id: 2, name: 'Trousers', description: 'Formal and casual trousers', status: 'active', productCount: 18, createdAt: '2024-01-10' },
    { id: 3, name: 'Tracks', description: 'Sports and casual track wear', status: 'active', productCount: 12, createdAt: '2024-01-05' },
    { id: 4, name: 'Shoes', description: 'Footwear collection', status: 'inactive', productCount: 8, createdAt: '2024-01-01' }
  ]

  const handleEdit = (id) => {
    console.log('Edit category:', id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      console.log('Delete category:', id)
    }
  }

  const columns = [
    { key: 'name', label: 'Category Name' },
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
    <div className="category-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Categories</h1>
          <p>Manage your product categories</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-category')}>
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search categories..."
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
        data={categories}
        columns={columns}
        searchTerm={searchTerm}
        searchKey="name"
      />
    </div>
  )
}

export default CategoryList