import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  Package,
  CheckCircle,
  Clock,
  X,
  Download,
  FileText,
  Receipt,
} from "lucide-react";
import DataTable from "../components/DataTable";
import { fetchOrders as fetchOrdersApi, updateOrderStatus } from "../api/order";
import jsPDF from "jspdf";

const OrdersList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await fetchOrdersApi();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowEditModal(true);
  };

  const handleUpdateStatus = async () => {
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      await fetchOrders();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const generatePackageSlip = (order) => {
    const pdf = new jsPDF();
    
    // Company info
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(244, 67, 54); // #F44336
    pdf.text('EN3 Fashion Store', 20, 15);
    pdf.setTextColor(0, 0, 0); // Reset to black
    
    // Left side - Order details
    pdf.setFontSize(10);
    pdf.text(`Order ID: #ORD-${order.id}`, 20, 25);
    pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 20, 32);
    
    // Right side - Ship To address
    pdf.text('Ship To:', 120, 25);
    pdf.setFont(undefined, 'normal');
    const address = order.shippingAddress;
    if (address) {
      pdf.text(address.fullName || order.user?.name || 'N/A', 120, 32);
      pdf.text(address.mobile || order.user?.phone || 'N/A', 120, 37);
      pdf.text(address.addressLine1 || '', 120, 42);
      pdf.text(address.addressLine2 || '', 120, 47);
      pdf.text(`${address.city || ''}, ${address.pincode || ''}`, 120, 52);
    } else {
      pdf.text('Address not provided', 120, 32);
    }
    
    // Items table header
    pdf.setFont(undefined, 'bold');
    pdf.text('Items in This Package:', 20, 60);
    
    // Table header background
    pdf.setFillColor(244, 67, 54); // #F44336
    pdf.rect(20, 65, 170, 10, 'F');
    
    // Table headers with white text
    pdf.setTextColor(255, 255, 255);
    pdf.text('Item', 25, 70);
    pdf.text('Size', 120, 70);
    pdf.text('Qty', 160, 70);
    
    // Reset text color to black
    pdf.setTextColor(0, 0, 0);
    
    // Line under header
    pdf.line(20, 75, 190, 75);
    
    // Items table
    pdf.setFont(undefined, 'normal');
    let yPos = 82;
    let itemCounter = 1;
    order.items?.forEach((item) => {
      if (item.type === 'bundle' && item.bundleItems) {
        // Show bundle items separately
        item.bundleItems.forEach((bundleItem) => {
          pdf.text(`${itemCounter}. Classic Cotton T-Shirt`, 20, yPos);
          pdf.text(bundleItem.size || 'N/A', 120, yPos);
          pdf.text('1', 160, yPos);
          yPos += 8;
          itemCounter++;
        });
      } else {
        // Show regular items
        pdf.text(`${itemCounter}. ${item.name}`, 20, yPos);
        pdf.text(item.size || 'N/A', 120, yPos);
        pdf.text(item.quantity?.toString() || '1', 160, yPos);
        yPos += 8;
        itemCounter++;
      }
    });
    
    // Footer
    pdf.setFont(undefined, 'italic');
    pdf.text('Thank you for shopping with us!', 105, yPos + 10, { align: 'center' });
    
    pdf.save(`package-slip-${order.id}.pdf`);
  };

  const generateAllPackageSlips = () => {
    const processingOrders = orders.filter(order => order.status === 'Processing');
    
    if (processingOrders.length === 0) {
      alert('No processing orders found');
      return;
    }

    const pdf = new jsPDF();
    let currentY = 0;
    let isFirstSlip = true;

    processingOrders.forEach((order, orderIndex) => {
      // Calculate slip height
      const itemCount = order.items?.reduce((count, item) => {
        return count + (item.type === 'bundle' && item.bundleItems ? item.bundleItems.length : 1);
      }, 0) || 0;
      const slipHeight = 85 + (itemCount * 6) + 15; // Base + items + footer

      // Check if slip fits on current page
      if (!isFirstSlip && currentY + slipHeight > 280) {
        pdf.addPage();
        currentY = 0;
      }
      isFirstSlip = false;

      // Generate slip at current position
      generateCompactPackageSlip(pdf, order, currentY);
      
      // Add scissor cut line
      const cutY = currentY + slipHeight + 5;
      drawScissorLine(pdf, cutY);
      
      currentY = cutY + 10;
    });

    pdf.save(`all-package-slips-processing.pdf`);
  };

  const generateCompactPackageSlip = (pdf, order, yOffset) => {
    // Company info
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(244, 67, 54); // #F44336
    pdf.text('EN3 Fashion Store', 20, 15 + yOffset);
    pdf.setTextColor(0, 0, 0); // Reset to black
    
    // Left side - Order details
    pdf.setFontSize(8);
    pdf.text(`Order ID: #ORD-${order.id}`, 20, 25 + yOffset);
    pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 20, 32 + yOffset);
    
    // Right side - Ship To address
    pdf.text('Ship To:', 120, 25 + yOffset);
    pdf.setFont(undefined, 'normal');
    const address = order.shippingAddress;
    if (address) {
      pdf.text(address.fullName || order.user?.name || 'N/A', 120, 32 + yOffset);
      pdf.text(address.mobile || order.user?.phone || 'N/A', 120, 37 + yOffset);
      pdf.text(address.addressLine1 || '', 120, 42 + yOffset);
      pdf.text(address.addressLine2 || '', 120, 47 + yOffset);
      pdf.text(`${address.city || ''}, ${address.pincode || ''}`, 120, 52 + yOffset);
    } else {
      pdf.text('Address not provided', 120, 32 + yOffset);
    }
    
    // Items table header
    pdf.setFont(undefined, 'bold');
    pdf.text('Items in This Package:', 20, 60 + yOffset);
    
    // Table header background
    pdf.setFillColor(244, 67, 54); // #F44336
    pdf.rect(20, 65 + yOffset, 170, 8, 'F');
    
    // Table headers with white text
    pdf.setTextColor(255, 255, 255);
    pdf.text('Item', 25, 70 + yOffset);
    pdf.text('Size', 120, 70 + yOffset);
    pdf.text('Qty', 160, 70 + yOffset);
    
    // Reset text color to black
    pdf.setTextColor(0, 0, 0);
    
    // Line under header
    pdf.line(20, 73 + yOffset, 190, 73 + yOffset);
    
    // Items table
    pdf.setFont(undefined, 'normal');
    let yPos = 78 + yOffset;
    let itemCounter = 1;
    order.items?.forEach((item) => {
      if (item.type === 'bundle' && item.bundleItems) {
        // Show bundle items separately
        item.bundleItems.forEach((bundleItem) => {
          pdf.text(`${itemCounter}. Classic Cotton T-Shirt`, 20, yPos);
          pdf.text(bundleItem.size || 'N/A', 120, yPos);
          pdf.text('1', 160, yPos);
          yPos += 6;
          itemCounter++;
        });
      } else {
        // Show regular items
        pdf.text(`${itemCounter}. ${item.name}`, 20, yPos);
        pdf.text(item.size || 'N/A', 120, yPos);
        pdf.text(item.quantity?.toString() || '1', 160, yPos);
        yPos += 6;
        itemCounter++;
      }
    });
    
    // Footer
    pdf.setFont(undefined, 'italic');
    pdf.text('Thank you for shopping with us!', 105, yPos + 8, { align: 'center' });
  };

  const drawScissorLine = (pdf, y) => {
    // Scissor symbols every inch (approximately 28.35 points per inch)
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    
    const startX = 15;
    const endX = 185;
    const inchInPoints = 28.35;
    
    for (let x = startX; x <= endX; x += inchInPoints) {
      pdf.text('>8', x, y + 1);
    }
    
    // Dashed cut line between scissors
    pdf.setLineDashPattern([2, 2], 0);
    pdf.line(startX + 10, y, endX, y);
    pdf.setLineDashPattern([], 0); // Reset to solid line
  };

  const generateInvoice = (order) => {
    const pdf = new jsPDF();
    
    // Header
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('INVOICE', 105, 30, { align: 'center' });
    
    // Company info - Left side
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text('EN3 Fashions', 20, 50);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text('Fashion Store', 20, 60);
    pdf.text('Contact: +91 XXXXX XXXXX', 20, 68);
    
    // Invoice details - Right side
    pdf.setFont(undefined, 'bold');
    pdf.text(`Invoice #: ORD-${order.id}`, 130, 50);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 130, 60);
    pdf.text(`Payment: ${order.paymentMethod}`, 130, 68);
    
    // Bill to - Left side
    pdf.setFont(undefined, 'bold');
    pdf.text('Bill To:', 20, 90);
    pdf.setFont(undefined, 'normal');
    pdf.text(`${order.user?.name || 'N/A'}`, 20, 100);
    pdf.text(`${order.user?.email || 'N/A'}`, 20, 108);
    pdf.text(`Phone: ${order.user?.phone || 'N/A'}`, 20, 116);
    
    // Ship to - Right side
    const address = order.shippingAddress;
    pdf.setFont(undefined, 'bold');
    pdf.text('Ship To:', 130, 90);
    pdf.setFont(undefined, 'normal');
    if (address) {
      pdf.text(address.fullName || 'N/A', 130, 100);
      pdf.text(`Phone: ${address.mobile || 'N/A'}`, 130, 108);
      pdf.text(address.addressLine1 || '', 130, 116);
      pdf.text(address.addressLine2 || '', 130, 124);
      pdf.text(`${address.city || ''}, ${address.pincode || ''}`, 130, 132);
    } else {
      pdf.text('Address not provided', 130, 100);
    }
    
    // Items table header
    pdf.setFont(undefined, 'bold');
    pdf.text('Item', 20, 150);
    pdf.text('Size', 100, 150);
    pdf.text('Qty', 130, 150);
    pdf.text('Price', 150, 150);
    pdf.text('Total', 170, 150);
    
    // Line under header
    pdf.line(20, 155, 190, 155);
    
    // Items
    pdf.setFont(undefined, 'normal');
    let yPos = 165;
    let subtotal = 0;
    
    order.items?.forEach((item) => {
      if (item.type === 'bundle' && item.bundleItems) {
        // Show bundle main item
        const bundleTotal = parseFloat(item.price) || 0;
        subtotal += bundleTotal;
        pdf.text((item.name || 'N/A').substring(0, 30), 20, yPos);
        pdf.text((item.quantity || 1).toString(), 130, yPos);
        pdf.text(`₹${item.price || 0}`, 150, yPos);
        pdf.text(`₹${bundleTotal}`, 170, yPos);
        yPos += 8;
        
        // Show bundle sub-items indented
        item.bundleItems.forEach((bundleItem) => {
          pdf.text(`   - ${bundleItem.color} (${bundleItem.size}) - Original Price ₹${bundleItem.originalPrice}`, 25, yPos);
          yPos += 6;
        });
        yPos += 4; // Extra space after bundle
      } else {
        // Show regular items
        const itemTotal = (parseFloat(item.price) || 0) * (item.quantity || 1);
        subtotal += itemTotal;
        const itemName = item.size && item.color ? `${item.name} (${item.size}, ${item.color})` : (item.name || 'N/A');
        pdf.text(itemName.substring(0, 35), 20, yPos);
        pdf.text((item.quantity || 1).toString(), 130, yPos);
        pdf.text(`₹${item.price || 0}`, 150, yPos);
        pdf.text(`₹${itemTotal}`, 170, yPos);
        yPos += 10;
      }
    });
    
    // Total section
    pdf.line(20, yPos + 5, 190, yPos + 5);
    pdf.setFont(undefined, 'bold');
    pdf.text(`Subtotal: ₹${order.subtotal || subtotal}`, 130, yPos + 20);
    
    if (order.discount && parseFloat(order.discount) > 0) {
      pdf.text(`Discount: -₹${order.discount}`, 130, yPos + 30);
      yPos += 10;
    }
    
    if (order.deliveryFee && parseFloat(order.deliveryFee) > 0) {
      pdf.text(`Delivery Fee: ₹${order.deliveryFee}`, 130, yPos + 30);
      yPos += 10;
    }
    
    pdf.text(`Total: ₹${order.total}`, 130, yPos + 40);
    
    // Footer
    pdf.setFont(undefined, 'italic');
    pdf.text('Thank you for your business!', 105, yPos + 70, { align: 'center' });
    
    pdf.save(`invoice-${order.id}.pdf`);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    return {
      pending: orders.filter((o) => o.status === "pending").length,
      processing: orders.filter((o) => o.status === "Processing").length,
      shipped: orders.filter((o) => o.status === "Shipped").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
    };
  };

  const statusCounts = getStatusCounts();

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "processing":
        return <Package size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "delivered":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const columns = [
    { key: "id", label: "Order ID", render: (value) => `#ORD-${value}` },
    {
      key: "user",
      label: "Customer",
      render: (value) => (
        <div className="customer-info">
          <div className="customer-name">{value?.name || "N/A"}</div>
          <div className="customer-email">{value?.email || "N/A"}</div>
          <div className="customer-phone">{value?.phone || "N/A"}</div>
        </div>
      ),
    },
    {
      key: "items",
      label: "Products",
      render: (value) => `${value?.length || 0} items`,
    },
    { key: "total", label: "Total", render: (value) => `₹${value}` },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <div className={`order-status ${value?.toLowerCase() || ""}`}>
          {getStatusIcon(value?.toLowerCase())}
          <span>{value || "N/A"}</span>
        </div>
      ),
    },
    {
      key: "paymentMethod",
      label: "Payment",
      render: (value) => (
        <span className={`payment-status ${value?.toLowerCase() || ""}`}>
          {value || "N/A"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (value) =>
        new Date(value).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="action-buttons">
          <button
            className="action-btn view"
            title="View Details"
            onClick={() => handleViewOrder(row)}
          >
            <Eye size={16} />
          </button>
          <button
            className="action-btn edit"
            title="Edit Order"
            onClick={() => handleEditOrder(row)}
          >
            <Edit size={16} />
          </button>
          {(row.status === 'Processing' || row.status === 'Shipped' || row.status === 'Delivered') && (
            <>
              <button
                className="action-btn download"
                title="Download Package Slip"
                onClick={() => generatePackageSlip(row)}
              >
                <Package size={16} />
              </button>
              <button
                className="action-btn download"
                title="Download Invoice"
                onClick={() => generateInvoice(row)}
              >
                <Receipt size={16} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="orders-list">
      <div className="page-header">
        <div className="header-left">
          <h1>Orders</h1>
          <p>Manage and track all customer orders</p>
        </div>
      </div>

      <div className="orders-stats">
        <div className="stat-card" onClick={() => setStatusFilter("pending")}>
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.pending}</h3>
            <p>Pending Orders</p>
          </div>
        </div>
        <div
          className="stat-card"
          onClick={() => setStatusFilter("processing")}
        >
          <div className="stat-icon processing">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.processing}</h3>
            <p>Processing</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setStatusFilter("shipped")}>
          <div className="stat-icon shipped">
            <Truck size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.shipped}</h3>
            <p>Shipped</p>
          </div>
        </div>
        <div className="stat-card" onClick={() => setStatusFilter("delivered")}>
          <div className="stat-icon delivered">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.delivered}</h3>
            <p>Delivered</p>
          </div>
        </div>
      </div>

      <div className="status-tabs">
        <button
          className={statusFilter === "all" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>
        <button
          className={statusFilter === "pending" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </button>
        <button
          className={statusFilter === "processing" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("processing")}
        >
          Processing
        </button>
        <button
          className={statusFilter === "shipped" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("shipped")}
        >
          Shipped
        </button>
        <button
          className={statusFilter === "delivered" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("delivered")}
        >
          Delivered
        </button>
        <button
          className={statusFilter === "cancelled" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("cancelled")}
        >
          Cancelled
        </button>
      </div>

      <div className="filters-section">
        <div className="search-container">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {statusFilter === "processing" && (
            <button
              className="download-all-btn"
              onClick={generateAllPackageSlips}
              title="Download All Package Slips"
            >
              <Download size={16} /> Download All Package Slips
            </button>
          )}
        </div>
      </div>

      <div className="table-container">
        <DataTable
          data={filteredOrders}
          columns={columns}
          searchTerm=""
          searchKey="user"
        />
      </div>

      {showViewModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - #ORD-{selectedOrder.id}</h2>
              <button onClick={() => setShowViewModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="order-details-grid">
                <div className="order-info">
                  <h4>Order Information</h4>
                  <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                  <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
                </div>
                <div className="shipping-address">
                  <h4>Shipping Address</h4>
                  {selectedOrder.shippingAddress ? (
                    <div>
                      <p><strong>Name:</strong> {selectedOrder.shippingAddress.fullName || 'N/A'}</p>
                      <p><strong>Phone:</strong> {selectedOrder.shippingAddress.mobile || 'N/A'}</p>
                      <p><strong>Address:</strong> {selectedOrder.shippingAddress.addressLine1 || ''}</p>
                      {selectedOrder.shippingAddress.addressLine2 && (
                        <p><strong>Address Line 2:</strong> {selectedOrder.shippingAddress.addressLine2}</p>
                      )}
                      <p><strong>City:</strong> {selectedOrder.shippingAddress.city || 'N/A'}</p>
                      <p><strong>Pincode:</strong> {selectedOrder.shippingAddress.pincode || 'N/A'}</p>
                    </div>
                  ) : (
                    <p>No shipping address provided</p>
                  )}
                </div>
              </div>
              {(selectedOrder.status === 'Processing' || selectedOrder.status === 'Shipped' || selectedOrder.status === 'Delivered') && (
                <div className="download-buttons">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => generatePackageSlip(selectedOrder)}
                  >
                    <Package size={16} /> Download Package Slip
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => generateInvoice(selectedOrder)}
                  >
                    <Receipt size={16} /> Download Invoice
                  </button>
                </div>
              )}
              <div className="order-items-section">
                <h4>Order Items</h4>
                <div className="order-items">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img src={item.imageUrl} alt={item.name} />
                      <div>
                        <p>
                          <strong>{item.name}</strong>
                        </p>
                        <p>
                          Size: {item.size}, Color: {item.color}
                        </p>
                        <p>
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Order Status - #ORD-{selectedOrder.id}</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <label>Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button className="btn btn-primary" onClick={handleUpdateStatus}>
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
