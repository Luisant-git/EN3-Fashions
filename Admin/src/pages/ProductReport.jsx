import React, { useState, useEffect, useRef } from 'react';
import { Download, X, Package, TrendingUp, Camera } from 'lucide-react';
import { getProductReport } from '../api/order';
import * as XLSX from 'xlsx-js-style';
import html2canvas from 'html2canvas';

const ProductSalesReport = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const screenshotRef = useRef(null);

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

  const takeScreenshot = async () => {
    if (screenshotRef.current) {
      try {
        setIsCapturing(true);
        const canvas = await html2canvas(screenshotRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        
        const link = document.createElement('a');
        const dateRange = startDate && endDate ? `_${startDate}_to_${endDate}` : startDate ? `_from_${startDate}` : endDate ? `_to_${endDate}` : '';
        link.download = `product-sales-report${dateRange}_${new Date().toISOString().split('T')[0]}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error('Error taking screenshot:', error);
      } finally {
        setIsCapturing(false);
      }
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
      'Initial Stock': product.initialStock,
      'Current Stock': product.currentStock,
      'Sale Stock': product.saleStock,
      'Price': product.price,
      'Total Sales Amount': product.totalSalesAmount
    }));

    // Add totals row
    const totals = {
      'S.No': '',
      'Product Name': '',
      'Color': '',
      'Size': '',
      'Variant ID': '',
      'HSN Code': 'TOTAL',
      'Initial Stock': filteredProducts.reduce((sum, p) => sum + p.initialStock, 0),
      'Current Stock': filteredProducts.reduce((sum, p) => sum + p.currentStock, 0),
      'Sale Stock': filteredProducts.reduce((sum, p) => sum + p.saleStock, 0),
      'Price': '',
      'Total Sales Amount': filteredProducts.reduce((sum, p) => sum + p.totalSalesAmount, 0).toFixed(2)
    };

    excelData.push({});
    excelData.push(totals);

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Product Sales Report');

    const dateRange = startDate && endDate ? `_${startDate}_to_${endDate}` : startDate ? `_from_${startDate}` : endDate ? `_to_${endDate}` : '';
    XLSX.writeFile(workbook, `product-sales-report${dateRange}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const filteredProducts = products.filter(product =>
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.color?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.size?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(product.sizeVariantId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(product.price || '').includes(searchTerm) ||
    String(product.totalSalesAmount || '').includes(searchTerm)
  );

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '700' }}>Product Sales Report</h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>View delivered product sales with stock tracking and revenue</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div style={{ flex: '1 1 300px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#374151' }}>Search</label>
          <input
            type="text"
            placeholder="Search by product, color, size, variant ID, price, sales amount..."
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
          onClick={takeScreenshot}
          disabled={isCapturing}
          style={{ padding: '10px 16px', background: isCapturing ? '#93c5fd' : '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: isCapturing ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative', minWidth: '130px', justifyContent: 'center' }}
        >
          {isCapturing ? (
            <>
              <div style={{ width: '16px', height: '16px', border: '2px solid #ffffff', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
              <span>Capturing...</span>
              <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
            </>
          ) : (
            <>
              <Camera size={16} /> Screenshot
            </>
          )}
        </button>
        <button
          onClick={exportToExcel}
          style={{ padding: '10px 16px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Download size={16} /> Export Excel
        </button>
      </div>

      {/* Screenshot Container */}
      <div ref={screenshotRef} style={{ background: 'white' }}>
        {/* Filter Info for Screenshot */}
        {(startDate || endDate || searchTerm) && (
          <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px', marginBottom: '16px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Applied Filters:</h3>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: '#6b7280' }}>
              {startDate && <span><strong>From:</strong> {startDate}</span>}
              {endDate && <span><strong>To:</strong> {endDate}</span>}
              {searchTerm && <span><strong>Search:</strong> {searchTerm}</span>}
            </div>
          </div>
        )}

      {/* Table */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>S.No</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Image</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Product</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Color</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Size</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Variant ID</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Initial Stock</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Sale Stock</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Current Stock</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Price</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: '#374151' }}>Total Sales</th>
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
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>{index + 1}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <img src={product.imageUrl} alt={product.productName} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e5e7eb' }} />
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827', fontWeight: '500' }}>{product.productName}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{product.color}</td>
                    <td style={{ padding: '12px 16px', fontSize: '14px', color: '#6b7280' }}>{product.size}</td>
                    <td style={{ padding: '12px 16px', fontSize: '13px', fontFamily: 'monospace', color: '#6b7280' }}>{String(product.sizeVariantId || '')}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#f59e0b', fontWeight: '600' }}>{product.initialStock}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#10b981', fontWeight: '600' }}>{product.saleStock}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#ef4444', fontWeight: '600' }}>{product.currentStock}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}>₹{product.price}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#7c3aed', fontWeight: '700' }}>₹{product.totalSalesAmount}</td>
                  </tr>
                ))
              )}
              {/* Totals Row */}
              {filteredProducts.length > 0 && (
                <tr style={{ background: '#f9fafb', borderTop: '2px solid #e5e7eb', fontWeight: '700' }}>
                  <td style={{ padding: '12px 16px' }}></td>
                  <td style={{ padding: '12px 16px' }}></td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#111827' }}>TOTAL</td>
                  <td style={{ padding: '12px 16px' }}></td>
                  <td style={{ padding: '12px 16px' }}></td>
                  <td style={{ padding: '12px 16px' }}></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#f59e0b', fontWeight: '700' }}>{filteredProducts.reduce((sum, p) => sum + p.initialStock, 0)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#10b981', fontWeight: '700' }}>{filteredProducts.reduce((sum, p) => sum + p.saleStock, 0)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#ef4444', fontWeight: '700' }}>{filteredProducts.reduce((sum, p) => sum + p.currentStock, 0)}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#6b7280' }}></td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontSize: '14px', color: '#7c3aed', fontWeight: '700' }}>₹{filteredProducts.reduce((sum, p) => sum + p.totalSalesAmount, 0).toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductSalesReport;
