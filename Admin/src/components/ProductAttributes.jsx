import React, { useState } from 'react'
import { Plus, X, Trash2 } from 'lucide-react'

const ProductAttributes = ({ attributes, onAttributesChange }) => {
  const [newAttribute, setNewAttribute] = useState({ name: '', values: [''] })

  const addAttribute = () => {
    if (newAttribute.name.trim() && newAttribute.values.some(v => v.trim())) {
      const filteredValues = newAttribute.values.filter(v => v.trim())
      const updatedAttributes = [...attributes, { 
        name: newAttribute.name.trim(), 
        values: filteredValues 
      }]
      onAttributesChange(updatedAttributes)
      setNewAttribute({ name: '', values: [''] })
    }
  }

  const removeAttribute = (index) => {
    const updatedAttributes = attributes.filter((_, i) => i !== index)
    onAttributesChange(updatedAttributes)
  }

  const updateAttributeValue = (index, value) => {
    const newValues = [...newAttribute.values]
    newValues[index] = value
    setNewAttribute(prev => ({ ...prev, values: newValues }))
  }

  const addAttributeValue = () => {
    setNewAttribute(prev => ({ ...prev, values: [...prev.values, ''] }))
  }

  const removeAttributeValue = (index) => {
    if (newAttribute.values.length > 1) {
      setNewAttribute(prev => ({
        ...prev,
        values: prev.values.filter((_, i) => i !== index)
      }))
    }
  }

  const addPredefinedAttribute = (name, values) => {
    const updatedAttributes = [...attributes, { name, values }]
    onAttributesChange(updatedAttributes)
  }

  return (
    <div className="attributes-section">
      {/* Quick Add Buttons */}
      <div className="quick-attributes">
        <button
          type="button"
          onClick={() => addPredefinedAttribute('Size', ['XS', 'S', 'M', 'L', 'XL', 'XXL'])}
          className="btn btn-outline btn-sm"
        >
          + Add Size
        </button>
        <button
          type="button"
          onClick={() => addPredefinedAttribute('Color', ['Red', 'Blue', 'Green', 'Black', 'White'])}
          className="btn btn-outline btn-sm"
        >
          + Add Color
        </button>
      </div>

      {/* Existing Attributes */}
      {attributes.length > 0 && (
        <div className="existing-attributes">
          {attributes.map((attr, index) => (
            <div key={index} className="attribute-item">
              <div className="attribute-header">
                <span className="attribute-name">{attr.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="remove-attribute"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="attribute-values">
                {attr.values.map((value, valueIndex) => (
                  <span key={valueIndex} className="attribute-value">
                    {value}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Custom Attribute */}
      <div className="add-attribute">
        <div className="form-group">
          <label className="form-label">Custom Attribute Name</label>
          <input
            type="text"
            className="form-input"
            value={newAttribute.name}
            onChange={(e) => setNewAttribute(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Material, Style, Pattern"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Attribute Values</label>
          <div className="attribute-values-input">
            {newAttribute.values.map((value, index) => (
              <div key={index} className="value-input-row">
                <input
                  type="text"
                  className="form-input"
                  value={value}
                  onChange={(e) => updateAttributeValue(index, e.target.value)}
                  placeholder={`Value ${index + 1}`}
                />
                {newAttribute.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttributeValue(index)}
                    className="remove-value"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addAttributeValue}
              className="add-value-btn"
            >
              <Plus size={16} /> Add Value
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={addAttribute}
          className="btn btn-outline add-attribute-btn"
        >
          <Plus size={16} /> Add Custom Attribute
        </button>
      </div>
    </div>
  )
}

export default ProductAttributes