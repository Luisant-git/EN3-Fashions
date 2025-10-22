import React, { useState, useEffect } from 'react'
import { Search, Filter, Eye, Edit, Mail, Phone, MapPin, UserPlus } from 'lucide-react'
import { getAllCustomers } from '../api/customerApi'

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers()
    }, 500)
    return () => clearTimeout(timer)
  }, [page, searchTerm])

  const fetchCustomers = async () => {
    setLoading(true)
    try {
      const response = await getAllCustomers(page, limit, searchTerm)
      setCustomers(response.data)
      setTotal(response.total)
      setTotalPages(response.totalPages)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Customer',
      render: (value, row) => (
        <div className="customer-profile">
          <div className="customer-avatar">
            {value.charAt(0).toUpperCase()}
          </div>
          <div className="customer-details">
            <div className="customer-name">{value}</div>
            <div className="customer-email">{row.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      label: 'Contact',
      render: (value, row) => (
        <div className="contact-info">
          <div className="phone">
            <Phone size={14} />
            {value}
          </div>
        </div>
      )
    },
    { key: 'ordersCount', label: 'Orders', render: (value) => `${value} orders` },
    { key: 'totalSpent', label: 'Total Spent', render: (value) => `₹${value.toFixed(2)}` },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`customer-status ${value.toLowerCase()}`}>
          {value}
        </span>
      )
    },
    { key: 'joinDate', label: 'Join Date', render: (value) => new Date(value).toLocaleDateString() },
    { key: 'lastOrder', label: 'Last Order', render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A' },
  ]

  return (
    <div className="customer-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Customers</h1>
          <p>Manage your customer database</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="table-container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((row) => (
                    <tr key={row.id}>
                      {columns.map((column) => (
                        <td key={column.key}>
                          {column.render 
                            ? column.render(row[column.key], row)
                            : row[column.key]
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pagination-controls">
              <button 
                className="pagination-btn"
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="pagination-info">Page {page} of {totalPages} ({total} customers)</span>
              <button 
                className="pagination-btn"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CustomerList
