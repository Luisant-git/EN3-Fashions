import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Upload, X, Plus, Edit2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { getProduct, updateProduct, getCategories, getSubCategories, getBrands, uploadImage } from '../api'

const EditProduct = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    brandId: '',
    basePrice: '',
    bundleOffers: [],
    tags: [],
    gallery: [],
    colors: [],
    status: 'active'
  })

  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingColor, setEditingColor] = useState(null)
  const [currentColor, setCurrentColor] = useState({ name: '', code: '', images: [], sizes: [] })
  const [currentSize, setCurrentSize] = useState({ size: '', price: '', quantity: 0 })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoriesData, subCategoriesData, brandsData] = await Promise.all([
          getProduct(id),
          getCategories(),
          getSubCategories(),
          getBrands()
        ])
        
        setFormData({
          ...productData,
          bundleOffers: productData.bundleOffers || []
        })
        setCategories(categoriesData)
        setSubCategories(subCategoriesData)
        setBrands(brandsData)
      } catch (err) {
        toast.error('Failed to load product data')
        navigate('/product-list')
      }
    }
    fetchData()
  }, [id, navigate])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleColorEdit = (index) => {
    const color = formData.colors[index]
    setCurrentColor({
      name: color.name,
      code: color.code,
      images: color.image ? [color.image] : [],
      sizes: color.sizes || []
    })
    setEditingColor(index)
  }

  const handleColorSave = () => {
    const colorData = {
      name: currentColor.name,
      code: currentColor.code,
      image: currentColor.images[0] || '',
      sizes: currentColor.sizes
    }
    
    const newColors = [...formData.colors]
    if (editingColor !== null) {
      newColors[editingColor] = colorData
    } else {
      newColors.push(colorData)
    }
    
    setFormData(prev => ({ ...prev, colors: newColors }))
    setCurrentColor({ name: '', code: '', images: [], sizes: [] })
    setEditingColor(null)
  }

  const handleColorDelete = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }))
  }

  const addSize = () => {
    if (currentSize.size && currentSize.price) {
      setCurrentColor(prev => ({
        ...prev,
        sizes: [...prev.sizes, { ...currentSize, quantity: parseInt(currentSize.quantity) || 0 }]
      }))
      setCurrentSize({ size: '', price: '', quantity: 0 })
    }
  }

  const handleColorImageUpload = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const uploadResult = await uploadImage(file)
        setCurrentColor(prev => ({
          ...prev,
          images: [uploadResult.url]
        }))
        toast.success('Color image uploaded!')
      } catch (err) {
        toast.error('Failed to upload image')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const productData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        subCategoryId: formData.subCategoryId ? parseInt(formData.subCategoryId) : null,
        brandId: formData.brandId ? parseInt(formData.brandId) : null
      }
      
      await updateProduct(id, productData)
      toast.success('Product updated successfully!')
      navigate('/product-list')
    } catch (err) {
      toast.error('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-product">
      <div className="page-header">
        <h1>Edit Product</h1>
        <p>Update product information</p>
      </div>
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <div className="section-header">
            <h3>Basic Information</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <select
                className="form-select"
                value={formData.brandId}
                onChange={(e) => handleInputChange('brandId', e.target.value)}
              >
                <option value="">Select Brand</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Pricing & Bundle Offers</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Base Price *</label>
            <input
              type="text"
              className="form-input"
              value={formData.basePrice}
              onChange={(e) => handleInputChange('basePrice', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Bundle Offers</label>
            <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              {(formData.bundleOffers || []).map((offer, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ minWidth: '80px', fontSize: '14px' }}>{offer.colorCount} Color{offer.colorCount > 1 ? 's' : ''}:</span>
                  <input
                    type="text"
                    value={offer.price}
                    onChange={(e) => {
                      const newOffers = [...(formData.bundleOffers || [])]
                      newOffers[index].price = e.target.value
                      handleInputChange('bundleOffers', newOffers)
                    }}
                    placeholder="Price"
                    style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newOffers = (formData.bundleOffers || []).filter((_, i) => i !== index)
                      handleInputChange('bundleOffers', newOffers)
                    }}
                    style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const currentOffers = formData.bundleOffers || []
                  const nextColorCount = currentOffers.length + 2
                  handleInputChange('bundleOffers', [...currentOffers, { colorCount: nextColorCount, price: '' }])
                }}
                style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', fontSize: '14px' }}
              >
                <Plus size={16} /> Add Bundle Offer
              </button>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Color Variants ({formData.colors?.length || 0})</h3>
          </div>

          {formData.colors && formData.colors.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {formData.colors.map((color, i) => (
                  <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                    {color.image && (
                      <img src={color.image} alt={color.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: color.code, border: '1px solid #e5e7eb' }}></div>
                        <strong>{color.name}</strong>
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                        {color.sizes?.length || 0} sizes available
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleColorEdit(i)}
                          style={{ flex: 1, padding: '8px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', fontSize: '12px' }}
                        >
                          <Edit2 size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleColorDelete(i)}
                          style={{ padding: '8px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(editingColor !== null || formData.colors?.length === 0) && (
            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h4>{editingColor !== null ? 'Edit Color' : 'Add New Color'}</h4>
              
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: '12px', marginBottom: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Color Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={currentColor.name}
                    onChange={(e) => setCurrentColor(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Red, Blue, Black"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <input
                    type="color"
                    className="form-input"
                    value={currentColor.code}
                    onChange={(e) => setCurrentColor(prev => ({ ...prev, code: e.target.value }))}
                    style={{ height: '42px', padding: '4px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Color Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleColorImageUpload}
                  className="form-input"
                />
                {currentColor.images.length > 0 && (
                  <img 
                    src={currentColor.images[0]} 
                    alt="Color preview" 
                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', marginTop: '8px' }} 
                  />
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <h5>Sizes</h5>
                <div style={{ display: 'grid', gridTemplateColumns: '100px 120px 120px auto', gap: '12px', alignItems: 'end', marginBottom: '12px' }}>
                  <select
                    value={currentSize.size}
                    onChange={(e) => setCurrentSize(prev => ({ ...prev, size: e.target.value }))}
                    style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  >
                    <option value="">Size</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                  <input
                    type="text"
                    value={currentSize.price}
                    onChange={(e) => setCurrentSize(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Price"
                    style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                  <input
                    type="number"
                    value={currentSize.quantity}
                    onChange={(e) => setCurrentSize(prev => ({ ...prev, quantity: e.target.value }))}
                    placeholder="Qty"
                    style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                  />
                  <button type="button" onClick={addSize} style={{ padding: '8px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px' }}>
                    Add Size
                  </button>
                </div>

                {currentColor.sizes.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {currentColor.sizes.map((size, i) => (
                      <span key={i} style={{ background: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                        {size.size} - ₹{size.price} (Qty: {size.quantity})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="button" 
                  onClick={handleColorSave}
                  disabled={!currentColor.name || !currentColor.code || currentColor.sizes.length === 0}
                  style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px' }}
                >
                  {editingColor !== null ? 'Update Color' : 'Add Color'}
                </button>
                {editingColor !== null && (
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingColor(null)
                      setCurrentColor({ name: '', code: '', images: [], sizes: [] })
                    }}
                    style={{ padding: '12px 24px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          {editingColor === null && formData.colors?.length > 0 && (
            <button
              type="button"
              onClick={() => setEditingColor(-1)}
              style={{ padding: '12px 24px', background: '#10b981', color: 'white', border: 'none', borderRadius: '6px' }}
            >
              <Plus size={16} /> Add New Color
            </button>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/product-list')}
            className="btn btn-outline"
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct