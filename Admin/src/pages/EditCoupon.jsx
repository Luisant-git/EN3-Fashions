import React, { useState, useEffect } from 'react'
import { ArrowLeft, Percent } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getCoupon, updateCoupon } from '../api/couponApi'
import '../styles/pages/add-coupon.scss'

const EditCoupon = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    minOrderAmount: '',
    maxDiscount: '',
    usageLimit: '',
    perUserLimit: '1',
    expiryDate: '',
    isActive: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCoupon()
  }, [id])

  const fetchCoupon = async () => {
    try {
      const data = await getCoupon(id)
      setFormData({
        code: data.code,
        type: data.type,
        value: data.value.toString(),
        minOrderAmount: data.minOrderAmount.toString(),
        maxDiscount: data.maxDiscount?.toString() || '',
        usageLimit: data.usageLimit?.toString() || '',
        perUserLimit: data.perUserLimit.toString(),
        expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : '',
        isActive: data.isActive
      })
    } catch (error) {
      toast.error('Failed to fetch coupon: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        code: formData.code,
        type: formData.type,
        value: parseFloat(formData.value),
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
        perUserLimit: parseInt(formData.perUserLimit) || 1,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : null,
        isActive: formData.isActive
      }
      await updateCoupon(id, data)
      toast.success('Coupon updated successfully!')
      navigate('/coupon-list')
    } catch (error) {
      toast.error('Failed to update coupon: ' + error.message)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="add-coupon">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Edit Coupon</h1>
          <p>Update coupon details</p>
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
              <input
                type="text"
                className="form-input"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Discount Type *</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  required
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Discount Value *</label>
                <div className="input-with-icon">
                  {formData.type === 'percentage' ? (
                    <Percent className="input-icon" size={16} />
                  ) : (
                    <span className="input-icon">₹</span>
                  )}
                  <input
                    type="number"
                    className="form-input"
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    placeholder={formData.type === 'percentage' ? '10' : '100'}
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
                  value={formData.minOrderAmount}
                  onChange={(e) => handleInputChange('minOrderAmount', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Maximum Discount</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.maxDiscount}
                  onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
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
                  value={formData.perUserLimit}
                  onChange={(e) => handleInputChange('perUserLimit', e.target.value)}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={formData.isActive ? 'active' : 'inactive'}
                onChange={(e) => handleInputChange('isActive', e.target.value === 'active')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/coupon-list')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Update Coupon
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCoupon
