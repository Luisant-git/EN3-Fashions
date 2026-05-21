import React, { useState, useEffect } from 'react';
import { Download, X, Package } from 'lucide-react';
import { getProductReport } from '../api/order';
import * as XLSX from 'xlsx-js-style';

const ProductReport = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getProductReport(startDate, endDate);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching product report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const excelData = filteredProducts.map((product, index) => ({
      'S.No': index + 1,
      'Product Name': product.productName,
      'Color': product.color,
      'Size': product.size,
      'Variant ID': product.sizeVariantId,
      'HSN Code': product.hsnCode,
      'Placed': product.placed,
      'Accepted': product.accepted,
      'Shipped': product.shipped,
      'Delivered': product.delivered,
      'Cancelled': product.cancelled,
      'Abandoned': product.abandoned,
      'Pending': product.pending,
      'Total Quantity': product.totalQuantity
    }));

    // Add totals row
    const totals = {
      'S.No': '',
      'Product Name': '',
      'Color': '',
      'Size': '',
      'Variant ID': '',
      'HSN Code': 'TOTAL',
      'Placed': filteredProducts.reduce((sum, p) => sum + p.placed, 0),
      'Accepted': filteredProducts.reduce((sum, p) => sum + p.accepted, 0),
      'Shipped': filteredProducts.reduce((sum, p) => sum + p.shipped, 0),
      'Delivered': filteredProducts.reduce((sum, p) => sum + p.delivered, 0),
      'Cancelled': filteredProducts.reduce((sum, p) => sum + p.cancelled, 0),
      'Abandoned': filteredProducts.reduce((sum, p) => sum + p.abandoned, 0),
      'Pending': filteredProducts.reduce((sum, p) => sum + p.pending, 0),
      'Total Quantity': filteredProducts.reduce((sum, p) => sum + p.totalQuantity, 0)
    };

    excelData.push({});
    excelData.push(totals);

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Report');

    const dateRange = startDate && endDate ? `_${startDate}_to_${endDate}` : startDate ? `_from_${startDate}` : endDate ? `_to_${endDate}` : '';
    XLSX.writeFile(workbook, `product-report${dateRange}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sizeVariantId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>Product Report</h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>View product sales by variant and order status</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 300px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>Search</label>
          <input
            type="text"
            placeholder="Search by product, color, size, variant ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>From</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>To</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{ padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
          />
        </div>
        <button
          onClick={() => { setStartDate(''); setEndDate(''); }}
          style={{ padding: '10px 16px', background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <X size={16} /> Reset
        </button>
        <button
          onClick={exportToExcel}
          style={{ padding: '10px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Download size={16} /> Export Excel
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '16px', background: '#f0f9ff', borderRadius: '12px', border: '1px solid #bae6fd' }}>
          <div style={{ fontSize: '12px', color: '#0369a1', fontWeight: '600', marginBottom: '4px' }}>Total Products</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#0c4a6e' }}>{filteredProducts.length}</div>
        </div>
        <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
          <div style={{ fontSize: '12px', color: '#15803d', fontWeight: '600', marginBottom: '4px' }}>Total Delivered</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#14532d' }}>{filteredProducts.reduce((sum, p) => sum + p.delivered, 0)}</div>
        </div>
        <div style={{ padding: '16px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a' }}>
          <div style={{ fontSize: '12px', color: '#92400e', fontWeight: '600', marginBottom: '4px' }}>Total Shipped</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#78350f' }}>{filteredProducts.reduce((sum, p) => sum + p.shipped, 0)}</div>
        </div>
        <div style={{ padding: '16px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '12px', color: '#991b1b', fontWeight: '600', marginBottom: '4px' }}>Total Cancelled</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#7f1d1d' }}>{filteredProducts.reduce((sum, p) => sum + p.cancelled, 0)}</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Image</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Product</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Color</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Size</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Variant ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Placed</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Accepted</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Shipped</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Delivered</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Cancelled</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="11" style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>
                    <Package size={48} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                    <div>No products found</div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={product.imageUrl} alt={product.productName} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827', fontWeight: '500' }}>{product.productName}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{product.color}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{product.size}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace', color: '#6b7280' }}>{product.sizeVariantId}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>{product.placed}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>{product.accepted}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>{product.shipped}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>{product.delivered}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#ef4444', fontWeight: '600' }}>{product.cancelled}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#111827', fontWeight: '700' }}>{product.totalQuantity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductReport;
