import React, { useState } from 'react'
import { Search, Filter, Plus, Edit, Trash2, Eye, Gift } from 'lucide-react'
import '../styles/pages/combo-offers.scss'

const ComboOffers = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const comboOffers = [
    {
      id: 1,
      name: 'Summer Electronics Bundle',
      products: ['Wireless Headphones', 'Smartphone Case'],
      originalPrice: '₹3,298',
      offerPrice: '₹2,799',
      discount: '15%',
      status: 'active',
      validUntil: '2024-02-15'
    },
    {
      id: 2,
      name: 'Fashion Combo Deal',
      products: ['Cotton T-Shirt', 'Running Shoes'],
      originalPrice: '₹4,098',
      offerPrice: '₹3,499',
      discount: '15%',
      status: 'active',
      validUntil: '2024-02-20'
    }
  ]

  return (
    <div className="combo-offers">
      <div className="page-header with-actions">
        <div className="header-left">
          <h1>Combo Offers</h1>
          <p>Create and manage product bundle offers</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Create Combo
        </button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search combo offers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <button className="btn btn-outline">
            <Filter size={20} />
            Filters
          </button>
        </div>
      </div>

      <div className="combo-grid">
        {comboOffers.map(combo => (
          <div key={combo.id} className="combo-card">
            <div className="combo-header">
              <div className="combo-icon">
                <Gift size={24} />
              </div>
              <div className="combo-actions">
                <button className="action-btn view">
                  <Eye size={16} />
                </button>
                <button className="action-btn edit">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="combo-content">
              <h3>{combo.name}</h3>
              <div className="combo-products">
                {combo.products.map((product, index) => (
                  <span key={index} className="product-tag">{product}</span>
                ))}
              </div>
              <div className="combo-pricing">
                <div className="original-price">{combo.originalPrice}</div>
                <div className="offer-price">{combo.offerPrice}</div>
                <div className="discount">{combo.discount} OFF</div>
              </div>
              <div className="combo-footer">
                <span className={`status ${combo.status}`}>{combo.status}</span>
                <span className="valid-until">Valid until {combo.validUntil}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ComboOffers
