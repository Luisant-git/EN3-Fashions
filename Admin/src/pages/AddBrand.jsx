import React, { useState } from 'react'
import { ArrowLeft, Upload, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/add-brand.scss'

const AddBrand = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    status: 'active'
  })
  const [logo, setLogo] = useState(null)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo({
          file,
          url: event.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogo(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Brand data:', formData, logo)
  }

  return (
    <div className="add-brand">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Add Brand</h1>
          <p>Create a new brand for your products</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="brand-form">
        <div className="form-grid">
          <div className="form-section">
            <div className="section-header">
              <h3>Brand Information</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Brand Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter brand name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter brand description"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Website</label>
              <input
                type="url"
                className="form-input"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
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

          <div className="form-section">
            <div className="section-header">
              <h3>Brand Logo</h3>
            </div>

            <div className="logo-upload-section">
              {!logo ? (
                <div className="logo-upload-area">
                  <input
                    type="file"
                    id="logo-upload"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="logo-input"
                  />
                  <label htmlFor="logo-upload" className="upload-label">
                    <Upload size={48} />
                    <p>Click to upload brand logo</p>
                    <span>PNG, JPG, SVG up to 5MB</span>
                  </label>
                </div>
              ) : (
                <div className="logo-preview">
                  <img src={logo.url || "/placeholder.svg"} alt="Brand Logo" />
                  <button
                    type="button"
                    className="remove-logo"
                    onClick={removeLogo}
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
            Create Brand
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddBrand
