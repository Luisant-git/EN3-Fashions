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
} from "lucide-react";
import DataTable from "../components/DataTable";
import { fetchOrders as fetchOrdersApi, updateOrderStatus } from "../api/order";

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
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
              <div className="order-info">
                <p>
                  <strong>Customer:</strong> {selectedOrder.user?.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.user?.email}
                </p>
                <p>
                  <strong>Status:</strong> {selectedOrder.status}
                </p>
                <p>
                  <strong>Payment:</strong> {selectedOrder.paymentMethod}
                </p>
                <p>
                  <strong>Total:</strong> ₹{selectedOrder.total}
                </p>
              </div>
              <h3>Items</h3>
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
