import React, { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createSubCategory, getCategories } from '../api'
import '../styles/pages/add-sub-category.scss'

const AddSubCategory = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    status: 'active'
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories()
        setCategories(categoriesData)
      } catch (err) {
        toast.error('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const subcategoryData = {
        name: formData.name,
        description: formData.description,
        categoryId: parseInt(formData.categoryId)
      }
      
      await createSubCategory(subcategoryData)
      toast.success('Sub category created successfully!')
      
      // Reset form
      setFormData({ name: '', description: '', categoryId: '', status: 'active' })
    } catch (err) {
      toast.error(err.message || 'Failed to create sub category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="add-sub-category">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Add Sub Category</h1>
          <p>Create a new product sub category</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
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
              value={formData.categoryId}
              onChange={(e) => handleInputChange('categoryId', e.target.value)}
              required
            >
              <option value="">Select Parent Category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Sub Category...' : 'Create Sub Category'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddSubCategory
