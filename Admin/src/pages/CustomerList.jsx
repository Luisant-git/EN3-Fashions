import React, { useState } from 'react'
import { Search, Filter, Eye, Edit, Mail, Phone, MapPin, UserPlus } from 'lucide-react'
import DataTable from '../components/DataTable'

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const customers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      location: 'Mumbai, India',
      orders: 12,
      totalSpent: '₹24,500',
      status: 'active',
      joinDate: '2023-06-15',
      lastOrder: '2024-01-10'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+91 9876543211',
      location: 'Delhi, India',
      orders: 8,
      totalSpent: '₹18,200',
      status: 'active',
      joinDate: '2023-08-22',
      lastOrder: '2024-01-08'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      phone: '+91 9876543212',
      location: 'Bangalore, India',
      orders: 15,
      totalSpent: '₹32,100',
      status: 'vip',
      joinDate: '2023-03-10',
      lastOrder: '2024-01-12'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      phone: '+91 9876543213',
      location: 'Chennai, India',
      orders: 3,
      totalSpent: '₹5,600',
      status: 'inactive',
      joinDate: '2023-11-05',
      lastOrder: '2023-12-20'
    },
    {
      id: 5,
      name: 'Tom Brown',
      email: 'tom@example.com',
      phone: '+91 9876543214',
      location: 'Pune, India',
      orders: 6,
      totalSpent: '₹12,800',
      status: 'active',
      joinDate: '2023-09-18',
      lastOrder: '2024-01-05'
    }
  ]

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
          <div className="location">
            <MapPin size={14} />
            {row.location}
          </div>
        </div>
      )
    },
    { key: 'orders', label: 'Orders', render: (value) => `${value} orders` },
    { key: 'totalSpent', label: 'Total Spent' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`customer-status ${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { key: 'joinDate', label: 'Join Date' },
    { key: 'lastOrder', label: 'Last Order' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button className="action-btn view" title="View Profile">
            <Eye size={16} />
          </button>
          <button className="action-btn edit" title="Edit Customer">
            <Edit size={16} />
          </button>
          <button className="action-btn mail" title="Send Email">
            <Mail size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="customer-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Customers</h1>
          <p>Manage your customer database</p>
        </div>
        <button className="btn btn-primary">
          <UserPlus size={20} />
          Add Customer
        </button>
      </div>

      <div className="customer-stats">
        <div className="stat-card">
          <div className="stat-content">
            <h3>1,234</h3>
            <p>Total Customers</p>
          </div>
          <div className="stat-trend positive">+12.5%</div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>856</h3>
            <p>Active Customers</p>
          </div>
          <div className="stat-trend positive">+8.3%</div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>45</h3>
            <p>VIP Customers</p>
          </div>
          <div className="stat-trend positive">+15.2%</div>
        </div>
        <div className="stat-card">
          <div className="stat-content">
            <h3>₹2,456</h3>
            <p>Avg. Order Value</p>
          </div>
          <div className="stat-trend negative">-3.1%</div>
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

        <div className="filter-group">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
          </select>

          <button className="btn btn-outline">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={customers}
          columns={columns}
          searchTerm={searchTerm}
          searchKey="name"
        />
      </div>
    </div>
  )
}

export default CustomerList
