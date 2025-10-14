import React, { useState, useEffect } from 'react'
import { Upload, X, Plus } from 'lucide-react'
import { toast } from 'react-toastify'
import ProductAttributes from '../components/ProductAttributes'
import { createProduct, getCategories, getSubCategories, getBrands, uploadImage } from '../api'

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    subCategoryId: '',
    brandId: '',
    price: '',
    comparePrice: '',
    costPrice: '',
    sku: '',
    barcode: '',
    trackQuantity: true,
    quantity: '',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    tags: [],
    seoTitle: '',
    seoDescription: '',
    status: 'active',
    attributes: []
  })

  const [images, setImages] = useState([])
  const [newTag, setNewTag] = useState('')
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return
    
    for (const file of files) {
      try {
        const uploadResult = await uploadImage(file)
        setImages(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: uploadResult.url,
          filename: uploadResult.filename
        }])
        toast.success('Image uploaded successfully!')
      } catch (err) {
        toast.error('Failed to upload image')
      }
    }
    
    e.target.value = ''
  }

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAttributesChange = (attributes) => {
    setFormData(prev => ({
      ...prev,
      attributes
    }))
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, subCategoriesData, brandsData] = await Promise.all([
          getCategories(),
          getSubCategories(),
          getBrands()
        ]);
        setCategories(categoriesData);
        setSubCategories(subCategoriesData);
        setBrands(brandsData);
      } catch (err) {
        setError('Failed to load form data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        subCategoryId: formData.subCategoryId ? parseInt(formData.subCategoryId) : null,
        brandId: formData.brandId ? parseInt(formData.brandId) : null,
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : null,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        sku: formData.sku,
        barcode: formData.barcode,
        trackQuantity: formData.trackQuantity,
        quantity: parseInt(formData.quantity) || 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        length: formData.dimensions.length ? parseFloat(formData.dimensions.length) : null,
        width: formData.dimensions.width ? parseFloat(formData.dimensions.width) : null,
        height: formData.dimensions.height ? parseFloat(formData.dimensions.height) : null,
        tags: formData.tags,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        image: images.length > 0 ? images[0].url : null,
        status: formData.status,
        attributes: formData.attributes
      };
      
      await createProduct(productData);
      toast.success('Product created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        subCategoryId: '',
        brandId: '',
        price: '',
        comparePrice: '',
        costPrice: '',
        sku: '',
        barcode: '',
        trackQuantity: true,
        quantity: '',
        weight: '',
        dimensions: { length: '', width: '', height: '' },
        tags: [],
        seoTitle: '',
        seoDescription: '',
        status: 'active',
        attributes: []
      });
      setImages([]);
    } catch (err) {
      const errorMsg = err.message || 'Failed to create product';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="add-product">
      <div className="page-header">
        <h1>Add Product</h1>
        <p>Create a new product for your store</p>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
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
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
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
                <label className="form-label">Sub Category</label>
                <select
                  className="form-select"
                  value={formData.subCategoryId}
                  onChange={(e) => handleInputChange('subCategoryId', e.target.value)}
                >
                  <option value="">Select Sub Category</option>
                  {subCategories
                    .filter(sub => !formData.categoryId || sub.categoryId === parseInt(formData.categoryId))
                    .map(subCategory => (
                      <option key={subCategory.id} value={subCategory.id}>
                        {subCategory.name}
                      </option>
                    ))}
                </select>
              </div>
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

          <div className="form-section">
            <div className="section-header">
              <h3>Product Images</h3>
            </div>

            <div className="image-upload-section">
              <div className="image-upload-area" onClick={() => document.getElementById('image-upload').click()}>
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <div className="upload-label">
                  <Upload size={48} />
                  <p>Click to upload images</p>
                  <span>PNG, JPG, GIF up to 10MB</span>
                </div>
              </div>

              {images.length > 0 && (
                <div className="image-preview-grid">
                  {images.map((image) => (
                    <div key={image.id} className="image-preview">
                      <img src={image.url || "/placeholder.svg"} alt="Product" />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(image.id)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-section">
            <div className="section-header">
              <h3>Pricing</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Price *</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Compare at Price</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.comparePrice}
                  onChange={(e) => handleInputChange('comparePrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Cost per Item</label>
              <input
                type="number"
                className="form-input"
                value={formData.costPrice}
                onChange={(e) => handleInputChange('costPrice', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Inventory</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  placeholder="Enter SKU"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Barcode</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.barcode}
                  onChange={(e) => handleInputChange('barcode', e.target.value)}
                  placeholder="Enter barcode"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="track-quantity"
                  checked={formData.trackQuantity}
                  onChange={(e) => handleInputChange('trackQuantity', e.target.checked)}
                />
                <label htmlFor="track-quantity">Track quantity</label>
              </div>
            </div>

            {formData.trackQuantity && (
              <div className="form-group">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  placeholder="0"
                />
              </div>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Shipping</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Weight</label>
              <input
                type="number"
                className="form-input"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="0.0 kg"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Dimensions (L × W × H)</label>
              <div className="dimensions-input">
                <input
                  type="number"
                  className="form-input"
                  value={formData.dimensions.length}
                  onChange={(e) => handleInputChange('dimensions.length', e.target.value)}
                  placeholder="Length"
                />
                <span>×</span>
                <input
                  type="number"
                  className="form-input"
                  value={formData.dimensions.width}
                  onChange={(e) => handleInputChange('dimensions.width', e.target.value)}
                  placeholder="Width"
                />
                <span>×</span>
                <input
                  type="number"
                  className="form-input"
                  value={formData.dimensions.height}
                  onChange={(e) => handleInputChange('dimensions.height', e.target.value)}
                  placeholder="Height"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Product Attributes</h3>
            <p>Add size, color, and other product variations</p>
          </div>

          <ProductAttributes 
            attributes={formData.attributes}
            onAttributesChange={handleAttributesChange}
          />
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>SEO & Tags</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div className="tags-input">
              <div className="tags-list">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="remove-tag"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="add-tag-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button type="button" onClick={addTag} className="add-tag-btn">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">SEO Title</label>
            <input
              type="text"
              className="form-input"
              value={formData.seoTitle}
              onChange={(e) => handleInputChange('seoTitle', e.target.value)}
              placeholder="Enter SEO title"
            />
          </div>

          <div className="form-group">
            <label className="form-label">SEO Description</label>
            <textarea
              className="form-textarea"
              value={formData.seoDescription}
              onChange={(e) => handleInputChange('seoDescription', e.target.value)}
              placeholder="Enter SEO description"
              rows={3}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Product...' : 'Publish Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddProduct
