import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getPincodes, deletePincode } from '../api/pincodeApi'
import DataTable from '../components/DataTable'

const PincodeList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [pincodes, setPincodes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPincodes()
  }, [])

  const fetchPincodes = async () => {
    try {
      const data = await getPincodes()
      setPincodes(data)
    } catch (error) {
      console.error('Error fetching pincodes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id) => {
    console.log('Edit pincode:', id)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pincode?')) {
      try {
        await deletePincode(id)
        fetchPincodes()
      } catch (error) {
        alert(error.message)
      }
    }
  }

  const columns = [
    { 
      key: 'pincode', 
      label: 'Pincode',
      render: (value) => (
        <div className="pincode-info">
          <MapPin size={16} className="pincode-icon" />
          <span className="pincode">{value}</span>
        </div>
      )
    },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { 
      key: 'deliveryDays', 
      label: 'Delivery Days',
      render: (value) => <span className="delivery-days">{value} days</span>
    },
    { 
      key: 'codAvailable', 
      label: 'COD Available',
      render: (value) => (
        <span className={`cod-status ${value ? 'available' : 'unavailable'}`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
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
    <div className="pincode-list">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Pincodes</h1>
          <p>Manage delivery pincodes and service areas</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/add-pincode')}>
          <Plus size={20} />
          Add Pincode
        </button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search pincodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable 
          data={pincodes}
          columns={columns}
          searchTerm={searchTerm}
          searchKey="pincode"
        />
      )}
    </div>
  )
}

export default PincodeList