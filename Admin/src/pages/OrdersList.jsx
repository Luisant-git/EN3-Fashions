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
    
    // Title - PACKING SLIP
    pdf.setFontSize(18);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(41, 98, 255); // Blue color
    pdf.text('PACKING SLIP', 20, 20);
    pdf.setTextColor(0, 0, 0);
    
    // Logo
    const logo = new Image();
    logo.src = '/EN3 LOGO PNG.png';
    try {
      pdf.addImage(logo, 'PNG', 20, 25, 30, 15);
    } catch (e) {
      console.log('Logo not loaded');
    }
    
    // Company info - Left side
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('KPG APPARELS', 20, 50);
    pdf.setFont(undefined, 'normal');
    pdf.text('2/3, KPG Buliding, Jothi Theater Road,', 20, 55);
    pdf.text('Valipalayam, Tiruppur,', 20, 60);
    pdf.text('TIRUPPUR, TAMIL NADU, 641601', 20, 65);
    pdf.text('IN', 20, 70);
    
    // Ship To - Right side with border
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(120, 30, 70, 35);
    pdf.setFont(undefined, 'bold');
    pdf.text('SHIP TO', 125, 37);
    pdf.setFont(undefined, 'normal');
    const address = order.shippingAddress;
    if (address) {
      pdf.text(address.fullName || order.user?.name || 'N/A', 125, 43);
      pdf.text(address.mobile || order.user?.phone || 'N/A', 125, 48);
      pdf.text(address.addressLine1 || '', 125, 53);
      if (address.addressLine2) pdf.text(address.addressLine2, 125, 58);
      pdf.text(`${address.city || ''}, ${address.pincode || ''}`, 125, address.addressLine2 ? 63 : 58);
    }
    
    // Order details
    pdf.setFontSize(10);
    pdf.text('Sales Order No', 20, 80);
    pdf.text(`: ORD-${new Date().getFullYear()}-${order.id}`, 60, 80);
    pdf.text('Order Date', 20, 87);
    pdf.text(`: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 60, 87);
    
    // Items table
    const tableTop = 100;
    pdf.setFillColor(220, 230, 255);
    pdf.rect(20, tableTop, 170, 10, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, tableTop, 170, 10);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Item', 25, tableTop + 7);
    pdf.text('Size', 120, tableTop + 7);
    pdf.text('Qty', 160, tableTop + 7);
    
    pdf.line(20, tableTop + 10, 190, tableTop + 10);
    
    // Items
    pdf.setFont(undefined, 'normal');
    let yPos = tableTop + 18;
    let itemCounter = 1;
    order.items?.forEach((item) => {
      if (item.type === 'bundle' && item.bundleItems) {
        item.bundleItems.forEach((bundleItem) => {
          pdf.text(`${itemCounter}. Classic Cotton T-Shirt (${bundleItem.color || 'N/A'})`, 20, yPos);
          pdf.text(bundleItem.size || 'N/A', 120, yPos);
          pdf.text('1', 160, yPos);
          yPos += 8;
          itemCounter++;
        });
      } else {
        const itemName = item.color ? `${item.name} (${item.color})` : item.name;
        pdf.text(`${itemCounter}. ${itemName}`, 20, yPos);
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
    const placedOrders = orders.filter(order => order.status === 'Placed');
    
    if (placedOrders.length === 0) {
      alert('No placed orders found');
      return;
    }

    const pdf = new jsPDF();
    let currentY = 0;
    let isFirstSlip = true;

    placedOrders.forEach((order, orderIndex) => {
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

    pdf.save(`all-package-slips-placed.pdf`);
  };

  const generateCompactPackageSlip = (pdf, order, yOffset) => {
    // Title - PACKING SLIP
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(41, 98, 255);
    pdf.text('PACKING SLIP', 20, 15 + yOffset);
    pdf.setTextColor(0, 0, 0);
    
    // Logo
    const logo = new Image();
    logo.src = '/EN3 LOGO PNG.png';
    try {
      pdf.addImage(logo, 'PNG', 20, 18 + yOffset, 25, 12);
    } catch (e) {
      console.log('Logo not loaded');
    }
    
    // Company info
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('KPG APPARELS', 20, 33 + yOffset);
    pdf.setFont(undefined, 'normal');
    pdf.text('2/3, KPG Buliding, Jothi Theater Road, Valipalayam, Tiruppur,', 20, 37 + yOffset);
    pdf.text('TIRUPPUR, TAMIL NADU, 641601', 20, 41 + yOffset);
    pdf.text('IN', 20, 45 + yOffset);
    
    // Ship To with border
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(120, 30 + yOffset, 70, 25);
    pdf.setFont(undefined, 'bold');
    pdf.text('SHIP TO', 125, 35 + yOffset);
    pdf.setFont(undefined, 'normal');
    const address = order.shippingAddress;
    if (address) {
      pdf.text(address.fullName || order.user?.name || 'N/A', 125, 40 + yOffset);
      pdf.text(address.mobile || order.user?.phone || 'N/A', 125, 44 + yOffset);
      pdf.text(address.addressLine1 || '', 125, 48 + yOffset);
      pdf.text(`${address.city || ''}, ${address.pincode || ''}`, 125, 52 + yOffset);
    }
    
    // Order details
    pdf.text('Sales Order No', 20, 60 + yOffset);
    pdf.text(`: ORD-${new Date().getFullYear()}-${order.id}`, 50, 60 + yOffset);
    pdf.text('Order Date', 20, 65 + yOffset);
    pdf.text(`: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 50, 65 + yOffset);
    
    // Items table
    const tableTop = 73 + yOffset;
    pdf.setFillColor(220, 230, 255);
    pdf.rect(20, tableTop, 170, 8, 'F');
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(20, tableTop, 170, 8);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Item', 25, tableTop + 5);
    pdf.text('Size', 120, tableTop + 5);
    pdf.text('Qty', 160, tableTop + 5);
    
    pdf.line(20, tableTop + 8, 190, tableTop + 8);
    
    // Items
    pdf.setFont(undefined, 'normal');
    let yPos = tableTop + 14;
    let itemCounter = 1;
    order.items?.forEach((item) => {
      if (item.type === 'bundle' && item.bundleItems) {
        item.bundleItems.forEach((bundleItem) => {
          pdf.text(`${itemCounter}. Classic Cotton T-Shirt (${bundleItem.color || 'N/A'})`, 20, yPos);
          pdf.text(bundleItem.size || 'N/A', 120, yPos);
          pdf.text('1', 160, yPos);
          yPos += 6;
          itemCounter++;
        });
      } else {
        const itemName = item.color ? `${item.name} (${item.color})` : item.name;
        pdf.text(`${itemCounter}. ${itemName}`, 20, yPos);
        pdf.text(item.size || 'N/A', 120, yPos);
        pdf.text(item.quantity?.toString() || '1', 160, yPos);
        yPos += 6;
        itemCounter++;
      }
    });
    
    // Footer
    pdf.setFont(undefined, 'italic');
    pdf.text('Thank you for shopping with us!', 105, yPos + 6, { align: 'center' });
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
    const address = order.shippingAddress;
    
    // State code mapping
    const getStateCode = (state) => {
      const stateCodes = {
        'ANDHRA PRADESH': '37', 'ARUNACHAL PRADESH': '12', 'ASSAM': '18', 'BIHAR': '10',
        'CHHATTISGARH': '22', 'GOA': '30', 'GUJARAT': '24', 'HARYANA': '06', 'HIMACHAL PRADESH': '02',
        'JHARKHAND': '20', 'KARNATAKA': '29', 'KERALA': '32', 'MADHYA PRADESH': '23', 'MAHARASHTRA': '27',
        'MANIPUR': '14', 'MEGHALAYA': '17', 'MIZORAM': '15', 'NAGALAND': '13', 'ODISHA': '21',
        'PUNJAB': '03', 'RAJASTHAN': '08', 'SIKKIM': '11', 'TAMIL NADU': '33', 'TELANGANA': '36',
        'TRIPURA': '16', 'UTTAR PRADESH': '09', 'UTTARAKHAND': '05', 'WEST BENGAL': '19',
        'ANDAMAN AND NICOBAR': '35', 'CHANDIGARH': '04', 'DADRA AND NAGAR HAVELI': '26',
        'DAMAN AND DIU': '25', 'DELHI': '07', 'JAMMU AND KASHMIR': '01', 'LADAKH': '38',
        'LAKSHADWEEP': '31', 'PUDUCHERRY': '34'
      };
      return stateCodes[state?.toUpperCase()] || '33';
    };
    
    const stateCode = getStateCode(address?.state);
    
    // Logo (Left side)
    const logo = new Image();
    logo.src = '/EN3 LOGO PNG.png';
    try {
      pdf.addImage(logo, 'PNG', 15, 15, 30, 15);
    } catch (e) {
      console.log('Logo not loaded');
    }
    
    // Invoice Title (Centered)
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('INVOICE', 105, 20, { align: 'center' });
    
    // Sold By Section (Left)
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.text('Sold By :', 15, 40);
    pdf.setFont(undefined, 'normal');
    pdf.text('KPG APPARELS', 15, 45);
    pdf.text('2/3, KPG Buliding, Jothi Theater Road, Valipalayam, Tiruppur,', 15, 50);
    pdf.text('TIRUPPUR, TAMIL NADU, 641601', 15, 55);
    pdf.text('IN', 15, 60);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('PAN No:', 15, 68);
    pdf.setFont(undefined, 'normal');
    pdf.text('AARFK8101F', 35, 68);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('GST Registration No:', 15, 73);
    pdf.setFont(undefined, 'normal');
    pdf.text('33AARFK8101F1ZG', 55, 73);
    
    // Billing Address (Right Top)
    pdf.setFont(undefined, 'bold');
    pdf.text('Billing Address :', 120, 35);
    pdf.setFont(undefined, 'normal');
    if (address) {
      let billingY = 40;
      pdf.text(address.fullName || order.user?.name || 'N/A', 120, billingY);
      billingY += 5;
      pdf.text(address.addressLine1 || '', 120, billingY);
      billingY += 5;
      if (address.addressLine2) {
        pdf.text(address.addressLine2, 120, billingY);
        billingY += 5;
      }
      pdf.text(`${address.city || ''}, ${address.state || 'N/A'}, ${address.pincode || ''}`, 120, billingY);
      billingY += 5;
      pdf.text('IN', 120, billingY);
    }
    
    // Shipping Address (Right Bottom)
    pdf.setFont(undefined, 'bold');
    pdf.text('Shipping Address :', 120, 75);
    pdf.setFont(undefined, 'normal');
    if (address) {
      let shippingY = 80;
      pdf.text(address.fullName || order.user?.name || 'N/A', 120, shippingY);
      shippingY += 5;
      pdf.text(address.mobile || order.user?.phone || 'N/A', 120, shippingY);
      shippingY += 5;
      pdf.text(address.addressLine1 || '', 120, shippingY);
      shippingY += 5;
      if (address.addressLine2) {
        pdf.text(address.addressLine2, 120, shippingY);
        shippingY += 5;
      }
      pdf.text(`${address.city || ''}, ${address.state || 'N/A'}, ${address.pincode || ''}`, 120, shippingY);
      shippingY += 5;
      pdf.text('IN', 120, shippingY);
      shippingY += 5;
      pdf.setFont(undefined, 'bold');
      pdf.text('Place of supply:', 120, shippingY);
      pdf.setFont(undefined, 'normal');
      pdf.text(address.state?.toUpperCase() || 'N/A', 148, shippingY);
      shippingY += 5;
      pdf.setFont(undefined, 'bold');
      pdf.text('Place of delivery:', 120, shippingY);
      pdf.setFont(undefined, 'normal');
      pdf.text(address.state?.toUpperCase() || 'N/A', 152, shippingY);
    }
    
    // Order Details (Left Bottom)
    pdf.setFont(undefined, 'bold');
    pdf.text('Order Number:', 15, 80);
    pdf.setFont(undefined, 'normal');
    pdf.text(`ORD-${new Date().getFullYear()}-${order.id}`, 45, 80);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Order Date:', 15, 85);
    pdf.setFont(undefined, 'normal');
    pdf.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 38, 85);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Invoice Number :', 15, 90);
    pdf.setFont(undefined, 'normal');
    pdf.text(`IN-${order.id}`, 50, 90);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Invoice Date :', 15, 95);
    pdf.setFont(undefined, 'normal');
    pdf.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 45, 95);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Mode of Payment:', 15, 100);
    pdf.setFont(undefined, 'normal');
    pdf.text(order.paymentMethod || 'Online', 52, 100);
    

    
    // Items Table
    const tableTop = 128;
    
    // Table Header Background
    pdf.setFillColor(220, 220, 220);
    pdf.rect(15, tableTop, 180, 8, 'F');
    
    // Table Headers
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('Sl.', 17, tableTop + 5);
    pdf.text('Description', 30, tableTop + 5);
    pdf.text('Unit Price', 120, tableTop + 5);
    pdf.text('Qty', 150, tableTop + 5);
    pdf.text('Total Amount', 170, tableTop + 5);
    
    // Table Border
    pdf.setDrawColor(0);
    pdf.rect(15, tableTop, 180, 8);
    
    // Items
    pdf.setFont(undefined, 'normal');
    let yPos = tableTop + 15;
    
    order.items?.forEach((item, index) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQty = item.quantity || 1;
      const itemTotal = itemPrice * itemQty;
      
      pdf.text((index + 1).toString(), 17, yPos);
      
      // Item description with size and color
      const itemDesc = item.size && item.color ? 
        `${item.name} - ${item.size}, ${item.color}` : 
        item.name || 'N/A';
      pdf.text(itemDesc.substring(0, 50), 30, yPos);
      
      pdf.text(`Rs.${itemPrice.toFixed(2)}`, 120, yPos);
      pdf.text(itemQty.toString(), 150, yPos);
      pdf.text(`Rs.${itemTotal.toFixed(2)}`, 170, yPos);
      
      yPos += 8;
    });
    
    // Get values from order
    const subtotal = parseFloat(order.subtotal) || 0;
    const discount = parseFloat(order.discount) || 0;
    const deliveryFee = parseFloat(order.deliveryFee) || 0;
    const total = parseFloat(order.total) || 0;
    
    // Calculate GST (reverse calculate from total)
    const afterDiscount = subtotal - discount;
    const totalWithDelivery = afterDiscount + deliveryFee;
    const gstAmount = total - totalWithDelivery;
    const cgstAmount = gstAmount / 2;
    const sgstAmount = gstAmount / 2;
    const taxRate = totalWithDelivery > 0 ? ((gstAmount / totalWithDelivery) * 100 / 2).toFixed(2) : 2.5;
    
    // Subtotal row
    pdf.setFont(undefined, 'normal');
    pdf.text('Subtotal:', 30, yPos);
    pdf.text(`Rs.${subtotal.toFixed(2)}`, 170, yPos);
    yPos += 6;
    
    // Discount row (if applicable)
    if (discount > 0) {
      pdf.text(`Discount (${order.couponCode || ''})`, 30, yPos);
      pdf.text(`- Rs.${discount.toFixed(2)}`, 170, yPos);
      yPos += 6;
    }
    
    // Delivery Fee row
    pdf.text('Delivery Fee:', 30, yPos);
    pdf.text(`Rs.${deliveryFee.toFixed(2)}`, 170, yPos);
    yPos += 6;
    
    // Add CGST row
    pdf.text(`CGST (${taxRate}%)`, 30, yPos);
    pdf.text(`Rs.${cgstAmount.toFixed(2)}`, 170, yPos);
    yPos += 6;
    
    // Add SGST row
    pdf.text(`SGST (${taxRate}%)`, 30, yPos);
    pdf.text(`Rs.${sgstAmount.toFixed(2)}`, 170, yPos);
    yPos += 8;
    
    // Total Row
    pdf.setFont(undefined, 'bold');
    pdf.text('TOTAL:', 17, yPos);
    pdf.text(`Rs.${total.toFixed(2)}`, 170, yPos);
    
    // Amount in Words
    yPos += 8;
    pdf.setFont(undefined, 'bold');
    pdf.text('Amount in Words:', 15, yPos);
    pdf.setFont(undefined, 'normal');
    const amountInWords = convertToWords(Math.round(total));
    pdf.text(amountInWords, 15, yPos + 5);
    
    // Authorized Signatory
    yPos += 20;
    pdf.setFont(undefined, 'bold');
    pdf.text('For EN3 FASHIONS:', 140, yPos);
    pdf.setFont(undefined, 'normal');
    pdf.text('Authorized Signatory', 140, yPos + 15);
    
    // Footer with Date & Time box
    yPos += 25;
    pdf.setFontSize(8);
    
    // Draw box for Date & Time
    pdf.setDrawColor(0);
    pdf.rect(15, yPos, 180, 10);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Date & Time:', 20, yPos + 6);
    pdf.setFont(undefined, 'normal');
    pdf.text(new Date(order.createdAt).toLocaleString('en-GB'), 45, yPos + 6);
    

    
    pdf.save(`invoice-${order.id}.pdf`);
  };
  
  const convertToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    if (num === 0) return 'Zero only';
    
    let words = '';
    
    if (num >= 100000) {
      words += ones[Math.floor(num / 100000)] + ' Lakh ';
      num %= 100000;
    }
    
    if (num >= 1000) {
      const thousands = Math.floor(num / 1000);
      if (thousands >= 10) {
        words += tens[Math.floor(thousands / 10)] + ' ';
        if (thousands % 10 > 0) words += ones[thousands % 10] + ' ';
      } else {
        words += ones[thousands] + ' ';
      }
      words += 'Thousand ';
      num %= 1000;
    }
    
    if (num >= 100) {
      words += ones[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    
    if (num >= 20) {
      words += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    } else if (num >= 10) {
      words += teens[num - 10] + ' ';
      num = 0;
    }
    
    if (num > 0) {
      words += ones[num] + ' ';
    }
    
    return words.trim() + ' only';
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
      placed: orders.filter((o) => o.status === "Placed").length,
      shipped: orders.filter((o) => o.status === "Shipped").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      abandoned: orders.filter((o) => o.status === "Abandoned").length,
    };
  };

  const statusCounts = getStatusCounts();

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "placed":
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
          {(row.status === 'Placed' || row.status === 'Shipped' || row.status === 'Delivered') && (
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
        <div
          className="stat-card"
          onClick={() => setStatusFilter("placed")}
        >
          <div className="stat-icon placed">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.placed}</h3>
            <p>Placed</p>
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
          className={statusFilter === "placed" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("placed")}
        >
          Placed
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
        <button
          className={statusFilter === "abandoned" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("abandoned")}
        >
          Abandoned ({statusCounts.abandoned})
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
          {statusFilter === "placed" && (
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
              <div className="order-details-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="order-info">
                  <h4>Order Information</h4>
                  <p><strong>Customer:</strong> {selectedOrder.user?.name}</p>
                  <p><strong>Email:</strong> {selectedOrder.user?.email}</p>
                  <p><strong>Status:</strong> {selectedOrder.status}</p>
                  <p><strong>Payment:</strong> {selectedOrder.paymentMethod}</p>
                  {selectedOrder.couponCode && (
                    <p><strong>Coupon:</strong> {selectedOrder.couponCode}</p>
                  )}
                  <p><strong>Total:</strong> ₹{selectedOrder.total}</p>
                </div>
                <div className="shipping-address">
                  <h4>Shipping Address</h4>
                  {selectedOrder.shippingAddress ? (
                    <div>
                      <p><strong>City:</strong> {selectedOrder.shippingAddress.city || 'N/A'}</p>
        
                      <p><strong>State:</strong> {selectedOrder.shippingAddress.state || 'N/A'}</p>
                      <p><strong>Pincode:</strong> {selectedOrder.shippingAddress.pincode || 'N/A'}</p>
                    </div>
                  ) : (
                    <p>No shipping address provided</p>
                  )}
                </div>
              </div>
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
                <option value="Placed">Placed</option>
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
