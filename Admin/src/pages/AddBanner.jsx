import React, { useState } from 'react'
import { ArrowLeft, Upload, X } from 'lucide-react'
import '../styles/pages/add-banner.scss'

const AddBanner = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    position: 'hero',
    status: 'active',
    startDate: '',
    endDate: ''
  })
  const [bannerImage, setBannerImage] = useState(null)

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
        setBannerImage({
          file,
          url: event.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setBannerImage(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Banner data:', formData, bannerImage)
  }

  return (
    <div className="add-banner">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Add Banner</h1>
          <p>Create a new promotional banner</p>
        </div>
        <button className="btn btn-outline">
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="banner-form">
        <div className="form-grid">
          <div className="form-section">
            <div className="section-header">
              <h3>Banner Content</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Banner Title *</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter banner title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter banner description"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Button Text</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  placeholder="Shop Now"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Button Link</label>
                <input
                  type="url"
                  className="form-input"
                  value={formData.buttonLink}
                  onChange={(e) => handleInputChange('buttonLink', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Position</label>
                <select
                  className="form-select"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                >
                  <option value="hero">Hero Section</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="footer">Footer</option>
                  <option value="popup">Popup</option>
                </select>
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
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Banner Image</h3>
            </div>

            <div className="image-upload-section">
              {!bannerImage ? (
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="image-input"
                  />
                  <label htmlFor="banner-upload" className="upload-label">
                    <Upload size={48} />
                    <p>Click to upload banner image</p>
                    <span>PNG, JPG up to 10MB (Recommended: 1920x600px)</span>
                  </label>
                </div>
              ) : (
                <div className="image-preview">
                  <img src={bannerImage.url || "/placeholder.svg"} alt="Banner" />
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
            Create Banner
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddBanner
