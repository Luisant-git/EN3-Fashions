import React, { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, X } from 'lucide-react'
import DataTable from '../components/DataTable'
import '../styles/pages/product-list.scss'

const productsData = [
  {
    id: 1,
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: '₹2,999',
    stock: 45,
    status: 'Active',
    image: '/diverse-people-listening-headphones.png'
  },
  {
    id: 2,
    name: 'Cotton T-Shirt',
    category: 'Clothing',
    price: '₹599',
    stock: 120,
    status: 'Active',
    image: '/plain-white-tshirt.png'
  },
  {
    id: 3,
    name: 'Smartphone Case',
    category: 'Accessories',
    price: '₹299',
    stock: 0,
    status: 'Out of Stock',
    image: '/stylish-phone-case.png'
  },
  {
    id: 4,
    name: 'Running Shoes',
    category: 'Footwear',
    price: '₹3,499',
    stock: 25,
    status: 'Active',
    image: '/assorted-shoes.png'
  },
  {
    id: 5,
    name: 'Coffee Mug',
    category: 'Home & Kitchen',
    price: '₹199',
    stock: 80,
    status: 'Active',
    image: '/ceramic-mug.png'
  }
]

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
  const [products, setProducts] = useState(productsData)
  const [modal, setModal] = useState({ type: null, product: null })

  // Modal handlers
  const openModal = (type, product) => setModal({ type, product })
  const closeModal = () => setModal({ type: null, product: null })

  // Edit handler (for demo, just closes modal)
  const handleEdit = (updatedProduct) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    closeModal()
  }

  // Delete handler
  const handleDelete = (id) => {
    setProducts(products.filter(p => p.id !== id))
    closeModal()
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
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    {
      key: 'stock',
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
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Price:</strong> {product.price}</p>
        <p><strong>Stock:</strong> {product.stock}</p>
        <p><strong>Status:</strong> {product.status}</p>
      </div>
    </div>
  )

  // Modal content for edit
  const EditModal = ({ product, onSave }) => {
    const [form, setForm] = useState({ ...product })
    return (
      <form className="modal-content edit-modal" onSubmit={e => { e.preventDefault(); onSave(form) }}>
        <h2>Edit Product</h2>
        <label>
          Name
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </label>
        <label>
          Category
          <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
        </label>
        <label>
          Price
          <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
        </label>
        <label>
          Stock
          <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} />
        </label>
        <label>
          Status
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            <option value="Active">Active</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </label>
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save</button>
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
        <button className="btn btn-primary">
          <Plus size={20} />
          Add Product
        </button>
      </div>

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
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="accessories">Accessories</option>
            <option value="footwear">Footwear</option>
            <option value="home-kitchen">Home & Kitchen</option>
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
    </div>
  )
}

export default ProductList
