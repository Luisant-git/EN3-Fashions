import React, { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import '../styles/pages/add-sub-category.scss'

const AddSubCategory = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentCategory: '',
    status: 'active'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Sub Category data:', formData)
  }

  return (
    <div className="add-sub-category">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Add Sub Category</h1>
          <p>Create a new product sub category</p>
        </div>
        <button className="btn btn-outline">
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="sub-category-form">
        <div className="form-section">
          <div className="section-header">
            <h3>Sub Category Information</h3>
          </div>

          <div className="form-group">
            <label className="form-label">Sub Category Name *</label>
            <input
              type="text"
              className="form-input"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter sub category name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Parent Category *</label>
            <select
              className="form-select"
              value={formData.parentCategory}
              onChange={(e) => handleInputChange('parentCategory', e.target.value)}
              required
            >
              <option value="">Select Parent Category</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="footwear">Footwear</option>
              <option value="accessories">Accessories</option>
              <option value="home-kitchen">Home & Kitchen</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter sub category description"
              rows={4}
            />
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

        <div className="form-actions">
          <button type="button" className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Create Sub Category
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddSubCategory
