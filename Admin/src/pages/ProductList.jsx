import React, { useState, useEffect } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, X, Upload } from 'lucide-react'
import { toast } from 'react-toastify'
import DataTable from '../components/DataTable'
import { getProducts, getProduct, updateProduct, deleteProduct, getCategories, getBrands, uploadImage } from '../api'
import '../styles/pages/product-list.scss'

// Modal component
const Modal = ({ open, onClose, children }) => {
  if (!open) return null
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="modal-close" onClick={onClose}><X size={20} /></button>
        {children}
      </div>
    </div>
  )
}

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [modal, setModal] = useState({ type: null, product: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [productsData, categoriesData, brandsData] = await Promise.all([
          getProducts(),
          getCategories(),
          getBrands()
        ])
        console.log('Products:', productsData)
        console.log('Categories:', categoriesData)
        console.log('Brands:', brandsData)
        console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)
        setProducts(productsData)
        setCategories(categoriesData)
        setBrands(brandsData)
      } catch (err) {
        console.error('Error loading data:', err)
        console.error('Error details:', err.message)
        const errorMsg = `Failed to load products: ${err.message}`
        setError(errorMsg)
        toast.error(errorMsg)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Modal handlers
  const openModal = async (type, product) => {
    if (type === 'view' || type === 'edit') {
      try {
        const fullProduct = await getProduct(product.id)
        setModal({ type, product: fullProduct })
      } catch (err) {
        console.error('Error loading product details:', err)
        const errorMsg = `Failed to load product details: ${err.message}`
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } else {
      setModal({ type, product })
    }
  }
  const closeModal = () => setModal({ type: null, product: null })

  // Edit handler
  const handleEdit = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct.id, updatedProduct)
      setProducts(products.map(p => p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p))
      toast.success('Product updated successfully!')
      closeModal()
    } catch (err) {
      console.error('Error updating product:', err)
      const errorMsg = `Failed to update product: ${err.message}`
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  // Delete handler
  const handleDelete = async (id) => {
    try {
      await deleteProduct(id)
      setProducts(products.filter(p => p.id !== id))
      toast.success('Product deleted successfully!')
      closeModal()
    } catch (err) {
      console.error('Error deleting product:', err)
      const errorMsg = `Failed to delete product: ${err.message}`
      setError(errorMsg)
      toast.error(errorMsg)
    }
  }

  const columns = [
    {
      key: 'image',
      label: 'Image',
      render: (value) => (
        <img src={value || "/placeholder.svg"} alt="Product" className="product-thumbnail" />
      )
    },
    { key: 'name', label: 'Product Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value, row) => row.category?.name || 'N/A'
    },
    { 
      key: 'price', 
      label: 'Price',
      render: (value) => `₹${value}`
    },
    {
      key: 'quantity',
      label: 'Stock',
      render: (value) => (
        <span className={`stock-badge ${value === 0 ? 'out-of-stock' : value < 20 ? 'low-stock' : 'in-stock'}`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => (
        <span className={`status-badge ${value.toLowerCase().replace(' ', '-')}`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div className="action-buttons">
          <button className="action-btn view" onClick={() => openModal('view', row)}>
            <Eye size={16} />
          </button>
          <button className="action-btn edit" onClick={() => openModal('edit', row)}>
            <Edit size={16} />
          </button>
          <button className="action-btn delete" onClick={() => openModal('delete', row)}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  // Modal content for view
  const ViewModal = ({ product }) => (
    <div className="modal-content view-modal">
      <h2>Product Details</h2>
      <img src={product.image || "/placeholder.svg"} alt={product.name} className="modal-product-image" />
      <div className="modal-product-info">
        <p><strong>Name:</strong> {product.name}</p>
        <p><strong>Description:</strong> {product.description || 'N/A'}</p>
        <p><strong>Category:</strong> {product.category?.name || 'N/A'}</p>
        <p><strong>SubCategory:</strong> {product.subCategory?.name || 'N/A'}</p>
        <p><strong>Brand:</strong> {product.brand?.name || 'N/A'}</p>
        <p><strong>Price:</strong> ₹{product.price}</p>
        <p><strong>Compare Price:</strong> {product.comparePrice ? `₹${product.comparePrice}` : 'N/A'}</p>
        <p><strong>SKU:</strong> {product.sku || 'N/A'}</p>
        <p><strong>Stock:</strong> {product.quantity}</p>
        <p><strong>Status:</strong> {product.status}</p>
        <p><strong>Weight:</strong> {product.weight ? `${product.weight} kg` : 'N/A'}</p>
        {product.tags && product.tags.length > 0 && (
          <p><strong>Tags:</strong> {product.tags.join(', ')}</p>
        )}
      </div>
    </div>
  )

  // Modal content for edit
  const EditModal = ({ product, onSave }) => {
    const [form, setForm] = useState({ 
      name: product.name,
      description: product.description || '',
      price: product.price,
      quantity: product.quantity,
      status: product.status,
      categoryId: product.categoryId,
      brandId: product.brandId || '',
      image: product.image || ''
    })
    const [saving, setSaving] = useState(false)
    const [imageUploading, setImageUploading] = useState(false)
    
    const handleImageUpload = async (e) => {
      const file = e.target.files[0]
      if (file) {
        setImageUploading(true)
        try {
          const uploadResult = await uploadImage(file)
          setForm(f => ({ ...f, image: uploadResult.url }))
          toast.success('Image uploaded successfully!')
        } catch (err) {
          toast.error('Failed to upload image')
        } finally {
          setImageUploading(false)
        }
      }
    }
    
    const handleSubmit = async (e) => {
      e.preventDefault()
      setSaving(true)
      try {
        await onSave({ ...product, ...form })
      } finally {
        setSaving(false)
      }
    }
    
    return (
      <form className="modal-content edit-modal" onSubmit={handleSubmit}>
        <h2>Edit Product</h2>
        <label>
          Product Image
          <div className="image-edit-section">
            {form.image && (
              <img src={form.image} alt="Product" className="current-image" style={{width: '100px', height: '100px', objectFit: 'cover', marginBottom: '10px'}} />
            )}
            <div className="image-upload-area" onClick={() => document.getElementById('edit-image-upload').click()}>
              <input
                type="file"
                id="edit-image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div className="upload-label">
                <Upload size={24} />
                <span>{imageUploading ? 'Uploading...' : 'Change Image'}</span>
              </div>
            </div>
          </div>
        </label>
        <label>
          Name
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </label>
        <label>
          Category
          <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: parseInt(e.target.value) }))} required>
            <option value="">Select Category</option>
            {categories && categories.length > 0 ? (
              categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </label>
        <label>
          Brand
          <select value={form.brandId} onChange={e => setForm(f => ({ ...f, brandId: e.target.value ? parseInt(e.target.value) : null }))}>
            <option value="">Select Brand</option>
            {brands && brands.length > 0 ? (
              brands.map(brand => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))
            ) : (
              <option disabled>No brands available</option>
            )}
          </select>
        </label>
        <label>
          Price
          <input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} required />
        </label>
        <label>
          Stock
          <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) }))} required />
        </label>
        <label>
          Status
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" onClick={closeModal} className="btn btn-outline">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving || imageUploading}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    )
  }

  // Modal content for delete
  const DeleteModal = ({ product, onDelete }) => (
    <div className="modal-content delete-modal">
      <h2>Delete Product</h2>
      <p>Are you sure you want to delete <strong>{product.name}</strong>?</p>
      <div className="modal-actions">
        <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
        <button className="btn btn-danger" onClick={() => onDelete(product.id)}>Delete</button>
      </div>
    </div>
  )

  return (
    <div className="product-list">
      <div className="page-header">
        <div className="header-left">
          <h1>Product List</h1>
          <p>Manage your product inventory</p>
        </div>
        <button className="btn btn-primary" onClick={() => window.location.href = '/add-product'}>
          <Plus size={20} />
          Add Product
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-message">Loading products...</div>
      ) : (
        <>
        <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Categories</option>
            {categories && categories.length > 0 ? (
              categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>No categories found</option>
            )}
          </select>

          <button className="btn btn-outline">
            <Filter size={20} />
            More Filters
          </button>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={products}
          columns={columns}
          searchTerm={searchTerm}
          searchKey="name"
        />
      </div>

      {/* Modals */}
      <Modal open={modal.type === 'view'} onClose={closeModal}>
        {modal.product && <ViewModal product={modal.product} />}
      </Modal>
      <Modal open={modal.type === 'edit'} onClose={closeModal}>
        {modal.product && <EditModal product={modal.product} onSave={handleEdit} />}
      </Modal>
      <Modal open={modal.type === 'delete'} onClose={closeModal}>
        {modal.product && <DeleteModal product={modal.product} onDelete={handleDelete} />}
      </Modal>
        </>
      )}
    </div>
  )
}

export default ProductList
