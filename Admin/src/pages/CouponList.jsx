import React, { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, Percent } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DataTable from '../components/DataTable'

const CouponList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const coupons = [
    { id: 1, code: 'SUMMER20', type: 'Percentage', value: '20%', minOrder: '₹500', maxDiscount: '₹200', status: 'active', used: 45, limit: 100, expiryDate: '2024-02-15' },
    { id: 2, code: 'FLAT100', type: 'Fixed', value: '₹100', minOrder: '₹1000', maxDiscount: '₹100', status: 'active', used: 23, limit: 50, expiryDate: '2024-02-20' },
    { id: 3, code: 'NEWUSER', type: 'Percentage', value: '15%', minOrder: '₹300', maxDiscount: '₹150', status: 'active', used: 78, limit: 200, expiryDate: '2024-03-01' },
    { id: 4, code: 'EXPIRED10', type: 'Percentage', value: '10%', minOrder: '₹250', maxDiscount: '₹100', status: 'expired', used: 150, limit: 150, expiryDate: '2024-01-01' }
  ]

  const handleEdit = (id) => {
    console.log('Edit coupon:', id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this coupon?')) {
      console.log('Delete coupon:', id)
    }
  }

  const columns = [
    { 
      key: 'code', 
      label: 'Coupon Code',
      render: (value) => (
        <div className="coupon-code">
          <Percent size={16} className="coupon-icon" />
          <span className="code">{value}</span>
        </div>
      )
    },
    { key: 'type', label: 'Type' },
    { key: 'value', label: 'Discount' },
    { key: 'minOrder', label: 'Min Order' },
    { key: 'maxDiscount', label: 'Max Discount' },
    { 
      key: 'used', 
      label: 'Usage',
      render: (value, row) => (
        <span className="usage-info">{value}/{row.limit}</span>
      )
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => (
        <span className={`status ${value}`}>{value}</span>
      )
    },
    { key: 'expiryDate', label: 'Expires' },
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
    <div className="coupon-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Coupons</h1>
          <p>Manage discount coupons and promotional codes</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-coupon')}>
          <Plus size={20} />
          Add Coupon
        </button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <DataTable 
        data={coupons}
        columns={columns}
        searchTerm={searchTerm}
        searchKey="code"
      />
    </div>
  )
}

export default CouponList