import React, { useState } from 'react'
import { Search, Filter, Eye, Edit, Truck, Package, CheckCircle, Clock } from 'lucide-react'
import DataTable from '../components/DataTable'

const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const orders = [
    {
      id: '#ORD-001',
      customer: 'John Doe',
      email: 'john@example.com',
      products: 3,
      total: '₹2,499',
      status: 'delivered',
      date: '2024-01-15',
      paymentStatus: 'paid'
    },
    {
      id: '#ORD-002',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      products: 1,
      total: '₹1,299',
      status: 'shipped',
      date: '2024-01-14',
      paymentStatus: 'paid'
    },
    {
      id: '#ORD-003',
      customer: 'Mike Johnson',
      email: 'mike@example.com',
      products: 2,
      total: '₹899',
      status: 'processing',
      date: '2024-01-13',
      paymentStatus: 'paid'
    },
    {
      id: '#ORD-004',
      customer: 'Sarah Wilson',
      email: 'sarah@example.com',
      products: 4,
      total: '₹3,499',
      status: 'pending',
      date: '2024-01-12',
      paymentStatus: 'pending'
    },
    {
      id: '#ORD-005',
      customer: 'Tom Brown',
      email: 'tom@example.com',
      products: 1,
      total: '₹599',
      status: 'cancelled',
      date: '2024-01-11',
      paymentStatus: 'refunded'
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} />
      case 'processing': return <Package size={16} />
      case 'shipped': return <Truck size={16} />
      case 'delivered': return <CheckCircle size={16} />
      default: return <Clock size={16} />
    }
  }

  const columns = [
    { key: 'id', label: 'Order ID' },
    { 
      key: 'customer', 
      label: 'Customer',
      render: (value, row) => (
        <div className="customer-info">
          <div className="customer-name">{value}</div>
          <div className="customer-email">{row.email}</div>
        </div>
      )
    },
    { key: 'products', label: 'Products', render: (value) => `${value} items` },
    { key: 'total', label: 'Total' },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <div className={`order-status ${value}`}>
          {getStatusIcon(value)}
          <span>{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </div>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Payment',
      render: (value) => (
        <span className={`payment-status ${value}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { key: 'date', label: 'Date' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button className="action-btn view" title="View Details">
            <Eye size={16} />
          </button>
          <button className="action-btn edit" title="Edit Order">
            <Edit size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="orders-list">
      <div className="page-header">
        <div className="header-left">
          <h1>Orders</h1>
          <p>Manage and track all customer orders</p>
        </div>
      </div>

      <div className="orders-stats">
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>23</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon processing">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>45</h3>
            <p>Processing</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon shipped">
            <Truck size={24} />
          </div>
          <div className="stat-content">
            <h3>67</h3>
            <p>Shipped</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon delivered">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>189</h3>
            <p>Delivered</p>
          </div>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
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
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button className="btn btn-outline">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={orders}
          columns={columns}
          searchTerm={searchTerm}
          searchKey="customer"
        />
      </div>
    </div>
  )
}

export default OrdersList
