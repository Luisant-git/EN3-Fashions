import React, { useState } from 'react'
import { ArrowLeft, Upload, X } from 'lucide-react'
import '../styles/pages/add-category.scss'

const AddCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    status: 'active',
    featured: false
  })
  const [image, setImage] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage({
          file,
          url: event.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Category data:', formData, image)
  }

  return (
    <div className="add-category">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Add Category</h1>
          <p>Create a new product category</p>
        </div>
        <button className="btn btn-outline">
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-grid">
          <div className="form-section">
            <div className="section-header">
              <h3>Category Information</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Category Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter category description"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Parent Category</label>
              <select
                className="form-select"
                value={formData.parentCategory}
                onChange={(e) => handleInputChange('parentCategory', e.target.value)}
              >
                <option value="">None (Root Category)</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
                <option value="home">Home & Garden</option>
              </select>
            </div>

            <div className="form-group">
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleInputChange('featured', e.target.checked)}
                />
                <label htmlFor="featured">Featured Category</label>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Category Image</h3>
            </div>

            <div className="image-upload-section">
              {!image ? (
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-input"
                  />
                  <label htmlFor="image-upload" className="upload-label">
                    <Upload size={48} />
                    <p>Click to upload category image</p>
                    <span>PNG, JPG up to 5MB</span>
                  </label>
                </div>
              ) : (
                <div className="image-preview">
                  <img src={image.url || "/placeholder.svg"} alt="Category" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={removeImage}
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline">
            Save as Draft
          </button>
          <button type="submit" className="btn btn-primary">
            Create Category
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCategory
