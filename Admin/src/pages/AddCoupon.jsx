import React, { useState } from 'react'
import { ArrowLeft, Percent } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../styles/pages/add-coupon.scss'

const AddCoupon = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minimumAmount: '',
    maximumDiscount: '',
    usageLimit: '',
    usagePerCustomer: '',
    startDate: '',
    endDate: '',
    status: 'active',
    applicableProducts: 'all'
  })

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateCouponCode = () => {
    const code = 'SAVE' + Math.random().toString(36).substr(2, 6).toUpperCase()
    handleInputChange('code', code)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Coupon data:', formData)
  }

  return (
    <div className="add-coupon">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Add Coupon</h1>
          <p>Create a new discount coupon</p>
        </div>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="coupon-form">
        <div className="form-grid">
          <div className="form-section">
            <div className="section-header">
              <h3>Coupon Details</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Coupon Code *</label>
              <div className="input-with-button">
                <input
                  type="text"
                  className="form-input"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={generateCouponCode}
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter coupon description"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Discount Type *</label>
                <select
                  className="form-select"
                  value={formData.discountType}
                  onChange={(e) => handleInputChange('discountType', e.target.value)}
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Discount Value *</label>
                <div className="input-with-icon">
                  {formData.discountType === 'percentage' ? (
                    <Percent className="input-icon" size={16} />
                  ) : (
                    <span className="input-icon">₹</span>
                  )}
                  <input
                    type="number"
                    className="form-input"
                    value={formData.discountValue}
                    onChange={(e) => handleInputChange('discountValue', e.target.value)}
                    placeholder={formData.discountType === 'percentage' ? '10' : '100'}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Minimum Order Amount</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.minimumAmount}
                  onChange={(e) => handleInputChange('minimumAmount', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Discount</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.maximumDiscount}
                  onChange={(e) => handleInputChange('maximumDiscount', e.target.value)}
                  placeholder="No limit"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="section-header">
              <h3>Usage Limits & Validity</h3>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Total Usage Limit</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.usageLimit}
                  onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                  placeholder="Unlimited"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Usage Per Customer</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.usagePerCustomer}
                  onChange={(e) => handleInputChange('usagePerCustomer', e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Start Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">End Date *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Applicable Products</label>
              <select
                className="form-select"
                value={formData.applicableProducts}
                onChange={(e) => handleInputChange('applicableProducts', e.target.value)}
              >
                <option value="all">All Products</option>
                <option value="specific">Specific Products</option>
                <option value="category">Specific Categories</option>
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
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline">
            Save as Draft
          </button>
          <button type="submit" className="btn btn-primary">
            Create Coupon
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCoupon
