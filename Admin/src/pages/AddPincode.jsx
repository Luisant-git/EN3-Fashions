import React, { useState } from 'react'
import { ArrowLeft, MapPin } from 'lucide-react'
import '../styles/pages/add-pincode.scss'

const AddPincode = () => {
  const [formData, setFormData] = useState({
    pincode: '',
    city: '',
    state: '',
    deliveryCharge: '',
    deliveryTime: '',
    codAvailable: true,
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
    console.log('Pincode data:', formData)
  }

  return (
    <div className="add-pincode">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Add Pincode</h1>
          <p>Add a new delivery pincode</p>
        </div>
        <button className="btn btn-outline">
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="pincode-form">
        <div className="form-section">
          <div className="section-header">
            <h3>Pincode Information</h3>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Pincode *</label>
              <div className="input-with-icon">
                <MapPin className="input-icon" size={16} />
                <input
                  type="text"
                  className="form-input"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  placeholder="Enter pincode"
                  maxLength="6"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                className="form-input"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Enter city name"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">State *</label>
            <select
              className="form-select"
              value={formData.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              required
            >
              <option value="">Select State</option>
              <option value="andhra-pradesh">Andhra Pradesh</option>
              <option value="karnataka">Karnataka</option>
              <option value="kerala">Kerala</option>
              <option value="tamil-nadu">Tamil Nadu</option>
              <option value="telangana">Telangana</option>
              <option value="maharashtra">Maharashtra</option>
              <option value="gujarat">Gujarat</option>
              <option value="rajasthan">Rajasthan</option>
              <option value="delhi">Delhi</option>
              <option value="uttar-pradesh">Uttar Pradesh</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Delivery Charge (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.deliveryCharge}
                onChange={(e) => handleInputChange('deliveryCharge', e.target.value)}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Delivery Time (Days)</label>
              <select
                className="form-select"
                value={formData.deliveryTime}
                onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
              >
                <option value="">Select delivery time</option>
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="5">5 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="cod-available"
                checked={formData.codAvailable}
                onChange={(e) => handleInputChange('codAvailable', e.target.checked)}
              />
              <label htmlFor="cod-available">Cash on Delivery Available</label>
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

        <div className="form-actions">
          <button type="button" className="btn btn-outline">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Add Pincode
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddPincode
