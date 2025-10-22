import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, Image } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import DataTable from '../components/DataTable'
import { getBanners, getBannerById, updateBanner, deleteBanner } from '../api/bannerApi'
import { uploadImage } from '../api/uploadApi'

const BannerList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewModal, setViewModal] = useState({ show: false, banner: null })
  const [editModal, setEditModal] = useState({ show: false, banner: null })
  const [editForm, setEditForm] = useState({ title: '', link: '', isActive: true, rowNumber: 1 })
  const [editImage, setEditImage] = useState(null)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const data = await getBanners()
      setBanners(data)
    } catch (error) {
      toast.error('Failed to fetch banners')
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (id) => {
    try {
      const banner = await getBannerById(id)
      setViewModal({ show: true, banner })
    } catch (error) {
      toast.error('Failed to fetch banner details')
    }
  }

  const handleEdit = async (id) => {
    try {
      const banner = await getBannerById(id)
      setEditForm({
        title: banner.title,
        link: banner.link,
        isActive: banner.isActive,
        rowNumber: banner.rowNumber || 1
      })
      setEditModal({ show: true, banner })
    } catch (error) {
      toast.error('Failed to fetch banner details')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)
    
    try {
      let imageUrl = editModal.banner.image
      
      if (editImage) {
        const imageResponse = await uploadImage(editImage.file)
        imageUrl = imageResponse.url
      }
      
      const updateData = {
        ...editForm,
        image: imageUrl
      }
      
      await updateBanner(editModal.banner.id, updateData)
      toast.success('Banner updated successfully!')
      setEditModal({ show: false, banner: null })
      setEditImage(null)
      fetchBanners()
    } catch (error) {
      toast.error(error.message || 'Failed to update banner')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteBanner(id)
        toast.success('Banner deleted successfully!')
        fetchBanners()
      } catch (error) {
        toast.error('Failed to delete banner')
      }
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setEditImage({
          file,
          url: event.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const columns = [
    { 
      key: 'title', 
      label: 'Banner Title',
      render: (value, row) => (
        <div className="banner-info">
          <img src={row.image} alt={value} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', marginRight: '8px'}} />
          <span>{value}</span>
        </div>
      )
    },
    { key: 'link', label: 'Link' },
    { 
      key: 'isActive', 
      label: 'Status',
      render: (value) => (
        <span className={`status ${value ? 'active' : 'inactive'}`}>{value ? 'Active' : 'Inactive'}</span>
      )
    },
    { key: 'rowNumber', label: 'Order' },
    { 
      key: 'createdAt', 
      label: 'Created',
      render: (value) => new Date(value).toLocaleDateString("en-GB"),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button className="action-btn view" onClick={() => handleView(row.id)} title="View">
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
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTable 
          data={banners}
          columns={columns}
          searchTerm={searchTerm}
          searchKey="title"
        />
      )}

      {/* View Modal */}
      {viewModal.show && (
        <div className="modal-overlay" onClick={() => setViewModal({ show: false, banner: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Banner Details</h3>
            <div className="banner-details">
              <img src={viewModal.banner.image} alt={viewModal.banner.title} style={{width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px'}} />
              <p><strong>Title:</strong> {viewModal.banner.title}</p>
              <p><strong>Link:</strong> {viewModal.banner.link}</p>
              <p><strong>Status:</strong> {viewModal.banner.isActive ? 'Active' : 'Inactive'}</p>
              <p><strong>Order:</strong> {viewModal.banner.rowNumber}</p>
            </div>
            <button onClick={() => setViewModal({ show: false, banner: null })}>Close</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal.show && (
        <div className="modal-overlay" onClick={() => setEditModal({ show: false, banner: null })}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Banner</h3>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Link</label>
                <input
                  type="url"
                  value={editForm.link}
                  onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editForm.isActive}
                  onChange={(e) => setEditForm({...editForm, isActive: e.target.value === 'true'})}
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={editForm.rowNumber}
                  onChange={(e) => setEditForm({...editForm, rowNumber: parseInt(e.target.value)})}
                  min="1"
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {editImage && <img src={editImage.url} alt="Preview" style={{width: '100px', height: '60px', objectFit: 'cover', marginTop: '8px'}} />}
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditModal({ show: false, banner: null })}>Cancel</button>
                <button type="submit" disabled={updating}>{updating ? 'Updating...' : 'Update'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Add some basic modal styles
const modalStyles = `
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}
.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal-actions button[type="submit"] {
  background: #007bff;
  color: white;
}
.modal-actions button[type="button"] {
  background: #6c757d;
  color: white;
}
`

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.textContent = modalStyles
  document.head.appendChild(styleSheet)
}

export default BannerList