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
import { fetchOrders as fetchOrdersApi, updateOrderStatus, uploadFile, deleteFile, deleteOrderFiles } from "../api/order";
import API_BASE_URL from "../api/config";
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
  const [uploading, setUploading] = useState(false);
  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [trackingLink, setTrackingLink] = useState("");
  const [signatureUrl, setSignatureUrl] = useState("");

  useEffect(() => {
    fetchOrders();
    fetchSignature();
  }, []);

  const fetchSignature = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`);
      const data = await response.json();
      if (data.signatureUrl) {
        setSignatureUrl(data.signatureUrl);
      }
    } catch (error) {
      console.error('Failed to fetch signature:', error);
    }
  };

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
    setCourierName("");
    setTrackingId("");
    setTrackingLink("");
    setShowEditModal(true);
  };

  const generatePDFBlob = (pdf) => {
    return pdf.output('blob');
  };

  const generateInvoicePDF = (order, forDownload = false) => {
    const pdf = new jsPDF();
    const address = order.shippingAddress;
    
    // Invoice Title (Centered)
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('INVOICE', 105, 20, { align: 'center' });
    
    // Sold By Section (Left)
    pdf.setFontSize(9);
    pdf.setFont(undefined, 'bold');
    pdf.text('Sold By :', 15, 35);
    pdf.setFont(undefined, 'normal');
    pdf.text('KPG APPARELS', 15, 40);
    pdf.text('2/3, KPG Buliding, Jothi Theater Road, Valipalayam, Tiruppur,', 15, 45);
    pdf.text('TIRUPPUR, TAMIL NADU, 641601', 15, 50);
    pdf.text('IN', 15, 55);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('PAN No:', 15, 63);
    pdf.setFont(undefined, 'normal');
    pdf.text('AARFK8101F', 35, 63);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('GST No:', 15, 68);
    pdf.setFont(undefined, 'normal');
    pdf.text('33AARFK8101F1ZG', 35, 68);
    
    pdf.line(15, 73, 190, 73);
    
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
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Order Number:', 15, 80);
    pdf.setFont(undefined, 'normal');
    pdf.text(`ORD-${new Date().getFullYear()}-${order.id}`, 45, 80);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Shipping Address :', 120, 80);
    pdf.setFont(undefined, 'normal');
    if (address) {
      let shippingY = 85;
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
    
    const tableTop = 128;
    pdf.setFillColor(220, 220, 220);
    pdf.rect(15, tableTop, 180, 8, 'F');
    pdf.setDrawColor(0);
    pdf.line(15, tableTop, 15, tableTop + 8);
    pdf.line(195, tableTop, 195, tableTop + 8);
    
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('Sl.', 17, tableTop + 5);
    pdf.text('Description', 30, tableTop + 5);
    pdf.text('HSN', 105, tableTop + 5);
    pdf.text('Unit Price', 125, tableTop + 5);
    pdf.text('Qty', 155, tableTop + 5);
    pdf.text('Total', 175, tableTop + 5);
    
    pdf.rect(15, tableTop, 180, 8);
    pdf.line(25, tableTop, 25, tableTop + 8);
    pdf.line(100, tableTop, 100, tableTop + 8);
    pdf.line(120, tableTop, 120, tableTop + 8);
    pdf.line(150, tableTop, 150, tableTop + 8);
    pdf.line(170, tableTop, 170, tableTop + 8);
    
    pdf.setFont(undefined, 'normal');
    let yPos = tableTop + 13;
    const tableStartY = yPos;
    let prevRowEndY = tableTop + 8;
    
    order.items?.forEach((item, index) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQty = item.quantity || 1;
      const itemTotal = itemPrice * itemQty;
      
      pdf.text((index + 1).toString(), 17, yPos);
      const itemDesc = item.size && item.color ? `${item.name} - ${item.size}, ${item.color}` : item.name || 'N/A';
      const lines = pdf.splitTextToSize(itemDesc, 65);
      pdf.text(lines, 30, yPos);
      pdf.text(item.hsnCode || 'N/A', 105, yPos);
      pdf.text(`Rs.${itemPrice.toFixed(2)}`, 145, yPos, { align: 'right' });
      pdf.text(itemQty.toString(), 160, yPos, { align: 'center' });
      pdf.text(`Rs.${itemTotal.toFixed(2)}`, 190, yPos, { align: 'right' });
      
      const rowHeight = lines.length * 5 + 5;
      const rowEndY = yPos + rowHeight - 5;
      
      pdf.line(15, rowEndY, 195, rowEndY);
      pdf.line(25, prevRowEndY, 25, rowEndY);
      pdf.line(100, prevRowEndY, 100, rowEndY);
      pdf.line(120, prevRowEndY, 120, rowEndY);
      pdf.line(150, prevRowEndY, 150, rowEndY);
      pdf.line(170, prevRowEndY, 170, rowEndY);
      
      prevRowEndY = rowEndY;
      yPos += rowHeight;
    });
    
    const subtotal = parseFloat(order.subtotal) || 0;
    const discount = parseFloat(order.discount) || 0;
    const deliveryFee = parseFloat(order.deliveryFee) || 0;
    const total = parseFloat(order.total) || 0;
    const deliveryGst = order.deliveryOption?.gst || {};
    const isSameState = deliveryGst.isSameState !== false;
    
    const gstRate = 5;
    const afterDiscount = subtotal - discount;
    const totalWithDelivery = afterDiscount + deliveryFee;
    const baseAmount = totalWithDelivery / (1 + gstRate / 100);
    const gstAmount = totalWithDelivery - baseAmount;
    const cgstAmount = isSameState ? (gstAmount / 2) : 0;
    const sgstAmount = isSameState ? (gstAmount / 2) : 0;
    const igstAmount = !isSameState ? gstAmount : 0;
    const taxRate = (gstRate / 2).toFixed(2);
    const igstRate = gstRate.toFixed(2);
    
    yPos += 5;
    pdf.setFont(undefined, 'normal');
    pdf.text('Subtotal (incl. GST):', 30, yPos);
    pdf.text(`Rs.${subtotal.toFixed(2)}`, 190, yPos, { align: 'right' });
    yPos += 6;
    
    if (discount > 0) {
      pdf.text(`Discount (${order.couponCode || ''})`, 30, yPos);
      pdf.text(`- Rs.${discount.toFixed(2)}`, 190, yPos, { align: 'right' });
      yPos += 6;
    }
    
    pdf.text('Delivery Fee (incl. GST):', 30, yPos);
    pdf.text(`Rs.${deliveryFee.toFixed(2)}`, 190, yPos, { align: 'right' });
    yPos += 6;
    pdf.text('Taxable Amount:', 30, yPos);
    pdf.text(`Rs.${baseAmount.toFixed(2)}`, 190, yPos, { align: 'right' });
    yPos += 6;
    
    if (isSameState) {
      pdf.text(`CGST (${taxRate}%)`, 30, yPos);
      pdf.text(`Rs.${cgstAmount.toFixed(2)}`, 190, yPos, { align: 'right' });
      yPos += 6;
      pdf.text(`SGST (${taxRate}%)`, 30, yPos);
      pdf.text(`Rs.${sgstAmount.toFixed(2)}`, 190, yPos, { align: 'right' });
      yPos += 8;
    } else {
      pdf.text(`IGST (${igstRate}%)`, 30, yPos);
      pdf.text(`Rs.${igstAmount.toFixed(2)}`, 190, yPos, { align: 'right' });
      yPos += 8;
    }
    
    pdf.setFont(undefined, 'bold');
    pdf.text('TOTAL:', 30, yPos);
    pdf.text(`Rs.${total.toFixed(2)}`, 190, yPos, { align: 'right' });
    
    yPos += 8;
    pdf.setFont(undefined, 'bold');
    pdf.text('Amount in Words:', 30, yPos);
    pdf.setFont(undefined, 'normal');
    const amountInWords = convertToWords(total);
    pdf.text(amountInWords, 30, yPos + 5);
    
    const finalTableHeight = (yPos + 10) - tableTop;
    pdf.rect(15, tableTop, 180, finalTableHeight);
    
    let footerY = yPos + 50;
    if (footerY > 250) {
      pdf.addPage();
      footerY = 30;
    }
    pdf.setFont(undefined, 'bold');
    pdf.text('For EN3 FASHIONS:', 140, footerY - 30);
    if (signatureUrl) {
      const signatureImg = new Image();
      signatureImg.src = signatureUrl;
      try {
        pdf.addImage(signatureImg, 'PNG', 140, footerY - 25, 40, 15);
      } catch (e) {
        console.log('Signature not loaded');
      }
    }
    pdf.setFont(undefined, 'normal');
    pdf.text('Authorized Signatory', 140, footerY - 5);
    
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('Date & Time:', 20, footerY + 6);
    pdf.setFont(undefined, 'normal');
    pdf.text(new Date().toLocaleString('en-GB'), 45, footerY + 6);
    
    if (forDownload) {
      pdf.save(`invoice-${order.id}.pdf`);
    }
    return pdf;
  };

  const handleUpdateStatus = async () => {
    try {
      setUploading(true);
      let invoiceUrl = null;
      let packageSlipUrl = null;

      if (newStatus === 'Shipped') {
        // Fetch fresh order data directly from API
        const freshOrders = await fetchOrdersApi();
        const orderToUse = freshOrders.find(o => o.id === selectedOrder.id);
        
        if (!orderToUse) {
          alert('Order not found');
          setUploading(false);
          return;
        }
        
        console.log('Fresh order data:', orderToUse);
        console.log('Order created at:', orderToUse.createdAt);
        console.log('Current time:', new Date().toLocaleString('en-GB'));
        
        // Delete ALL old invoice and package slip files for this order
        await deleteOrderFiles(orderToUse.id).catch(e => console.log('Error deleting old files:', e));
        
        // Wait a moment to ensure deletion completes
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Always generate new PDFs
        try {
          console.log('Generating invoice at:', new Date().toLocaleString('en-GB'));
          const invoicePdf = generateInvoicePDF(orderToUse, false);
          const invoiceBlob = generatePDFBlob(invoicePdf);
          const invoiceFile = new File([invoiceBlob], `invoice-${orderToUse.id}.pdf`, { type: 'application/pdf' });
          const invoiceResult = await uploadFile(invoiceFile);
          invoiceUrl = invoiceResult.url;

          const packagePdf = createPackageSlipPDF(orderToUse);
          const packageBlob = generatePDFBlob(packagePdf);
          const packageFile = new File([packageBlob], `packageslip-${orderToUse.id}.pdf`, { type: 'application/pdf' });
          const packageResult = await uploadFile(packageFile);
          packageSlipUrl = packageResult.url;
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          alert('Failed to upload documents. Status will not be changed.');
          setUploading(false);
          return;
        }
      }

      await updateOrderStatus(
        selectedOrder.id, 
        newStatus, 
        invoiceUrl, 
        packageSlipUrl, 
        courierName || "not provided", 
        trackingId || "not provided", 
        trackingLink || "not provided"
      );
      await fetchOrders();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert('Failed to update order status');
    } finally {
      setUploading(false);
    }
  };

  const createPackageSlipPDF = (order, yOffset = 0) => {
    const pdf = new jsPDF();
    const address = order.shippingAddress;
    
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(41, 98, 255);
    pdf.text('PACKING SLIP', 20, 15 + yOffset);
    pdf.setTextColor(0, 0, 0);
    
    const logo = new Image();
    logo.src = '/EN3 LOGO PNG.png';
    try {
      pdf.addImage(logo, 'PNG', 20, 18 + yOffset, 25, 12);
    } catch (e) {
      console.log('Logo not loaded');
    }
    
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'bold');
    pdf.text('KPG APPARELS', 20, 33 + yOffset);
    pdf.setFont(undefined, 'normal');
    pdf.text('2/3, KPG Buliding, Jothi Theater Road, Valipalayam, Tiruppur,', 20, 37 + yOffset);
    pdf.text('TIRUPPUR, TAMIL NADU, 641601', 20, 41 + yOffset);
    pdf.text('IN', 20, 45 + yOffset);
    
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(120, 30 + yOffset, 70, 25);
    pdf.setFont(undefined, 'bold');
    pdf.text('SHIP TO', 125, 35 + yOffset);
    pdf.setFont(undefined, 'normal');
    if (address) {
      pdf.text(address.fullName || order.user?.name || 'N/A', 125, 40 + yOffset);
      pdf.text(address.mobile || order.user?.phone || 'N/A', 125, 44 + yOffset);
      pdf.text(address.addressLine1 || '', 125, 48 + yOffset);
      pdf.text(`${address.city || ''}, ${address.pincode || ''}`, 125, 52 + yOffset);
    }
    
    pdf.text('Sales Order No', 20, 60 + yOffset);
    pdf.text(`: ORD-${new Date().getFullYear()}-${order.id}`, 50, 60 + yOffset);
    pdf.text('Order Date', 20, 65 + yOffset);
    pdf.text(`: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 50, 65 + yOffset);
    
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
    
    pdf.setFont(undefined, 'normal');
    let yPos = tableTop + 14;
    let itemCounter = 1;
    order.items?.forEach((item) => {
      if (item.type === 'bundle' && item.bundleItems) {
        item.bundleItems.forEach((bundleItem) => {
          const itemName = `${itemCounter}. Classic Cotton T-Shirt (${bundleItem.color || 'N/A'})`;
          const lines = pdf.splitTextToSize(itemName, 95);
          pdf.text(lines, 20, yPos);
          pdf.text(bundleItem.size || 'N/A', 120, yPos);
          pdf.text('1', 160, yPos);
          yPos += lines.length * 4 + 2;
          itemCounter++;
        });
      } else {
        const itemName = item.color ? `${itemCounter}. ${item.name} (${item.color})` : `${itemCounter}. ${item.name}`;
        const lines = pdf.splitTextToSize(itemName, 95);
        pdf.text(lines, 20, yPos);
        pdf.text(item.size || 'N/A', 120, yPos);
        pdf.text(item.quantity?.toString() || '1', 160, yPos);
        yPos += lines.length * 4 + 2;
        itemCounter++;
      }
    });
    
    pdf.setFont(undefined, 'italic');
    pdf.text('Thank you for shopping with us!', 105, yPos + 6, { align: 'center' });
    
    return pdf;
  };

  const generatePackageSlip = (order) => {
    const pdf = createPackageSlipPDF(order);
    pdf.save(`package-slip-${order.id}.pdf`);
  };

  const generateAllPackageSlips = () => {
    const placedOrders = orders.filter(order => order.status === 'Placed');
    
    if (placedOrders.length === 0) {
      alert('No placed orders found');
      return;
    }

    const pdf = new jsPDF();
    let isFirstSlip = true;

    placedOrders.forEach((order, orderIndex) => {
      if (!isFirstSlip) {
        pdf.addPage();
      }
      isFirstSlip = false;

      const address = order.shippingAddress;
      
      pdf.setFontSize(14);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(41, 98, 255);
      pdf.text('PACKING SLIP', 20, 15);
      pdf.setTextColor(0, 0, 0);
      
      const logo = new Image();
      logo.src = '/EN3 LOGO PNG.png';
      try {
        pdf.addImage(logo, 'PNG', 20, 18, 25, 12);
      } catch (e) {
        console.log('Logo not loaded');
      }
      
      pdf.setFontSize(8);
      pdf.setFont(undefined, 'bold');
      pdf.text('KPG APPARELS', 20, 33);
      pdf.setFont(undefined, 'normal');
      pdf.text('2/3, KPG Buliding, Jothi Theater Road, Valipalayam, Tiruppur,', 20, 37);
      pdf.text('TIRUPPUR, TAMIL NADU, 641601', 20, 41);
      pdf.text('IN', 20, 45);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(120, 30, 70, 25);
      pdf.setFont(undefined, 'bold');
      pdf.text('SHIP TO', 125, 35);
      pdf.setFont(undefined, 'normal');
      if (address) {
        pdf.text(address.fullName || order.user?.name || 'N/A', 125, 40);
        pdf.text(address.mobile || order.user?.phone || 'N/A', 125, 44);
        pdf.text(address.addressLine1 || '', 125, 48);
        pdf.text(`${address.city || ''}, ${address.pincode || ''}`, 125, 52);
      }
      
      pdf.text('Sales Order No', 20, 60);
      pdf.text(`: ORD-${new Date().getFullYear()}-${order.id}`, 50, 60);
      pdf.text('Order Date', 20, 65);
      pdf.text(`: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 50, 65);
      
      const tableTop = 73;
      pdf.setFillColor(220, 230, 255);
      pdf.rect(20, tableTop, 170, 8, 'F');
      pdf.setDrawColor(200, 200, 200);
      pdf.rect(20, tableTop, 170, 8);
      
      pdf.setFont(undefined, 'bold');
      pdf.text('Item', 25, tableTop + 5);
      pdf.text('Size', 120, tableTop + 5);
      pdf.text('Qty', 160, tableTop + 5);
      pdf.line(20, tableTop + 8, 190, tableTop + 8);
      
      pdf.setFont(undefined, 'normal');
      let yPos = tableTop + 14;
      let itemCounter = 1;
      order.items?.forEach((item) => {
        if (item.type === 'bundle' && item.bundleItems) {
          item.bundleItems.forEach((bundleItem) => {
            const itemName = `${itemCounter}. Classic Cotton T-Shirt (${bundleItem.color || 'N/A'})`;
            const lines = pdf.splitTextToSize(itemName, 95);
            pdf.text(lines, 20, yPos);
            pdf.text(bundleItem.size || 'N/A', 120, yPos);
            pdf.text('1', 160, yPos);
            yPos += lines.length * 4 + 2;
            itemCounter++;
          });
        } else {
          const itemName = item.color ? `${itemCounter}. ${item.name} (${item.color})` : `${itemCounter}. ${item.name}`;
          const lines = pdf.splitTextToSize(itemName, 95);
          pdf.text(lines, 20, yPos);
          pdf.text(item.size || 'N/A', 120, yPos);
          pdf.text(item.quantity?.toString() || '1', 160, yPos);
          yPos += lines.length * 4 + 2;
          itemCounter++;
        }
      });
      
      pdf.setFont(undefined, 'italic');
      pdf.text('Thank you for shopping with us!', 105, yPos + 6, { align: 'center' });
    });

    pdf.save(`all-package-slips-placed.pdf`);
  };



  const generateInvoice = (order) => {
    generateInvoicePDF(order, true);
  };

  const generateCombinedDocument = (order) => {
    const pdf = new jsPDF();
    const address = order.shippingAddress;

    pdf.setDrawColor(200);
    pdf.line(105, 0, 105, 148.5);
    pdf.line(0, 148.5, 210, 148.5);

    // === PACKAGE SLIP - Top Left ===
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(41, 98, 255);
    pdf.text('PACKING SLIP', 10, 8);
    pdf.setTextColor(0, 0, 0);
    
    const logo = new Image();
    logo.src = '/EN3 LOGO PNG.png';
    try {
      pdf.addImage(logo, 'PNG', 10, 11, 15, 7);
    } catch (e) {}
    
    pdf.setFontSize(7);
    pdf.setFont(undefined, 'bold');
    pdf.text('KPG APPARELS', 10, 22);
    pdf.setFont(undefined, 'normal');
    pdf.text('2/3, KPG Buliding, Jothi Theater Road,', 10, 25);
    pdf.text('Valipalayam, Tiruppur,', 10, 28);
    pdf.text('TIRUPPUR, TAMIL NADU, 641601', 10, 31);
    pdf.text('IN', 10, 34);
    
    pdf.setDrawColor(200, 200, 200);
    pdf.rect(60, 18, 35, 26);
    pdf.setFont(undefined, 'bold');
    pdf.text('SHIP TO', 62, 22);
    pdf.setFont(undefined, 'normal');
    if (address) {
      let shipY = 25;
      pdf.text(address.fullName || order.user?.name || 'N/A', 62, shipY);
      shipY += 3;
      pdf.text(address.mobile || order.user?.phone || 'N/A', 62, shipY);
      shipY += 3;
      const shipAddr1 = pdf.splitTextToSize(address.addressLine1 || '', 30);
      pdf.text(shipAddr1, 62, shipY);
      shipY += shipAddr1.length * 3;
      if (address.addressLine2) {
        const shipAddr2 = pdf.splitTextToSize(address.addressLine2, 30);
        pdf.text(shipAddr2, 62, shipY);
        shipY += shipAddr2.length * 3;
      }
      pdf.text(`${address.city || ''}, ${address.pincode || ''}`, 62, shipY);
    }
    
    pdf.setFontSize(7);
    pdf.setFont(undefined, 'normal');
    pdf.text('Sales Order No', 10, 40);
    pdf.text(`: ORD-${new Date().getFullYear()}-${order.id}`, 32, 40);
    pdf.text('Order Date', 10, 44);
    pdf.text(`: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 32, 44);
    
    const pkgTableTop = 50;
    pdf.setFillColor(220, 230, 255);
    pdf.rect(10, pkgTableTop, 85, 6, 'F');
    pdf.rect(10, pkgTableTop, 85, 6);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Item', 12, pkgTableTop + 4);
    pdf.text('Size', 70, pkgTableTop + 4);
    pdf.text('Qty', 85, pkgTableTop + 4);
    
    pdf.line(10, pkgTableTop, 10, pkgTableTop + 6);
    pdf.line(68, pkgTableTop, 68, pkgTableTop + 6);
    pdf.line(82, pkgTableTop, 82, pkgTableTop + 6);
    pdf.line(95, pkgTableTop, 95, pkgTableTop + 6);
    
    pdf.setFont(undefined, 'normal');
    let yPos = pkgTableTop + 10;
    const pkgItemStartY = yPos;
    let itemCounter = 1;
    
    order.items?.forEach((item) => {
      if (item.type === 'bundle' && item.bundleItems) {
        item.bundleItems.forEach((bundleItem) => {
          const itemName = `${itemCounter}. Classic Cotton T-Shirt (${bundleItem.color || 'N/A'})`;
          const lines = pdf.splitTextToSize(itemName, 50);
          pdf.text(lines, 12, yPos);
          pdf.text(bundleItem.size || 'N/A', 70, yPos);
          pdf.text('1', 85, yPos);
          yPos += lines.length * 3.5 + 1;
          itemCounter++;
        });
      } else {
        const itemName = item.color ? `${itemCounter}. ${item.name} (${item.color})` : `${itemCounter}. ${item.name}`;
        const lines = pdf.splitTextToSize(itemName, 50);
        pdf.text(lines, 12, yPos);
        pdf.text(item.size || 'N/A', 70, yPos);
        pdf.text(item.quantity?.toString() || '1', 85, yPos);
        yPos += lines.length * 3.5 + 1;
        itemCounter++;
      }
    });
    
    const pkgItemEndY = yPos;
    pdf.line(10, pkgItemEndY, 95, pkgItemEndY);
    pdf.line(10, pkgTableTop + 6, 10, pkgItemEndY);
    pdf.line(68, pkgTableTop + 6, 68, pkgItemEndY);
    pdf.line(82, pkgTableTop + 6, 82, pkgItemEndY);
    pdf.line(95, pkgTableTop + 6, 95, pkgItemEndY);
    
    pdf.setFont(undefined, 'italic');
    pdf.text('Thank you for shopping with us!', 52, pkgItemEndY + 6, { align: 'center' });

    // === INVOICE - Top Right ===
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('INVOICE', 150, 10);
    
    pdf.setFontSize(5);
    pdf.setFont(undefined, 'bold');
    pdf.text('Sold By :', 108, 16);
    pdf.setFont(undefined, 'normal');
    pdf.text('KPG APPARELS', 108, 19);
    pdf.text('2/3, KPG Buliding, Jothi Theater Road, Valipalayam,', 108, 21);
    pdf.text('Tiruppur,', 108, 23);
    pdf.text('TIRUPPUR, TAMIL NADU, 641601', 108, 25);
    pdf.text('IN', 108, 27);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Billing Address :', 155, 16);
    pdf.setFont(undefined, 'normal');
    if (address) {
      let billY = 19;
      pdf.text(address.fullName || order.user?.name || 'N/A', 155, billY);
      billY += 2.5;
      const billLine1 = pdf.splitTextToSize(address.addressLine1 || '', 42);
      pdf.text(billLine1, 155, billY);
      billY += billLine1.length * 2.5;
      if (address.addressLine2) {
        const billLine2 = pdf.splitTextToSize(address.addressLine2, 42);
        pdf.text(billLine2, 155, billY);
        billY += billLine2.length * 2.5;
      }
      pdf.text(`${address.city || ''}, ${address.state || 'N/A'}, ${address.pincode || ''}`, 155, billY);
      billY += 2.5;
      pdf.text('IN', 155, billY);
    }
    
    pdf.setFont(undefined, 'bold');
    pdf.text('PAN No:', 108, 31);
    pdf.setFont(undefined, 'normal');
    pdf.text('AARFK8101F', 120, 31);
    pdf.setFont(undefined, 'bold');
    pdf.text('GST No:', 108, 34);
    pdf.setFont(undefined, 'normal');
    pdf.text('33AARFK8101F1ZG', 120, 34);
    
    pdf.line(108, 37, 202, 37);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Order Number:', 108, 41);
    pdf.setFont(undefined, 'normal');
    pdf.text(`ORD-${new Date().getFullYear()}-${order.id}`, 130, 41);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Shipping Address :', 155, 41);
    pdf.setFont(undefined, 'normal');
    if (address) {
      let shipY = 44;
      pdf.text(address.fullName || order.user?.name || 'N/A', 155, shipY);
      shipY += 2.5;
      pdf.text(address.mobile || order.user?.phone || 'N/A', 155, shipY);
      shipY += 2.5;
      const shipLine1 = pdf.splitTextToSize(address.addressLine1 || '', 42);
      pdf.text(shipLine1, 155, shipY);
      shipY += shipLine1.length * 2.5;
      if (address.addressLine2) {
        const shipLine2 = pdf.splitTextToSize(address.addressLine2, 42);
        pdf.text(shipLine2, 155, shipY);
        shipY += shipLine2.length * 2.5;
      }
      pdf.text(`${address.city || ''}, ${address.state || 'N/A'}, ${address.pincode || ''}`, 155, shipY);
      shipY += 2.5;
      pdf.text('IN', 155, shipY);
      shipY += 2.5;
      pdf.setFont(undefined, 'bold');
      pdf.text('Place of supply:', 155, shipY);
      pdf.setFont(undefined, 'normal');
      pdf.text(address.state?.toUpperCase() || 'N/A', 173, shipY);
      shipY += 2.5;
      pdf.setFont(undefined, 'bold');
      pdf.text('Place of delivery:', 155, shipY);
      pdf.setFont(undefined, 'normal');
      pdf.text(address.state?.toUpperCase() || 'N/A', 175, shipY);
    }
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Order Date:', 108, 44);
    pdf.setFont(undefined, 'normal');
    pdf.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 125, 44);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Invoice Number :', 108, 47);
    pdf.setFont(undefined, 'normal');
    pdf.text(`IN-${order.id}`, 133, 47);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Invoice Date :', 108, 50);
    pdf.setFont(undefined, 'normal');
    pdf.text(new Date(order.createdAt).toLocaleDateString('en-GB'), 130, 50);
    
    pdf.setFont(undefined, 'bold');
    pdf.text('Mode of Payment:', 108, 53);
    pdf.setFont(undefined, 'normal');
    pdf.text(order.paymentMethod || 'Online', 133, 53);
    
    // Items table
    const tableTop = 68;
    pdf.setFillColor(220, 220, 220);
    pdf.rect(108, tableTop, 94, 6, 'F');
    pdf.rect(108, tableTop, 94, 6);
    
    pdf.setFontSize(5);
    pdf.setFont(undefined, 'bold');
    pdf.text('Sl.', 109, tableTop + 4);
    pdf.text('Description', 118, tableTop + 4);
    pdf.text('HSN', 165, tableTop + 4);
    pdf.text('Unit Price', 175, tableTop + 4);
    pdf.text('Qty', 190, tableTop + 4);
    pdf.text('Total', 197, tableTop + 4);
    
    pdf.line(108, tableTop, 108, tableTop + 6);
    pdf.line(115, tableTop, 115, tableTop + 6);
    pdf.line(163, tableTop, 163, tableTop + 6);
    pdf.line(173, tableTop, 173, tableTop + 6);
    pdf.line(188, tableTop, 188, tableTop + 6);
    pdf.line(195, tableTop, 195, tableTop + 6);
    pdf.line(202, tableTop, 202, tableTop + 6);
    
    pdf.setFont(undefined, 'normal');
    yPos = tableTop + 10;
    const itemStartY = yPos;
    
    order.items?.forEach((item, index) => {
      const itemPrice = parseFloat(item.price) || 0;
      const itemQty = item.quantity || 1;
      const itemTotal = itemPrice * itemQty;
      
      pdf.text((index + 1).toString(), 109, yPos);
      const itemDesc = item.size && item.color ? `${item.name} - ${item.size}, ${item.color}` : item.name || 'N/A';
      const lines = pdf.splitTextToSize(itemDesc, 43);
      pdf.text(lines, 118, yPos);
      pdf.text(item.hsnCode || 'N/A', 165, yPos);
      pdf.text(`Rs.${itemPrice.toFixed(2)}`, 175, yPos);
      pdf.text(itemQty.toString(), 190, yPos);
      pdf.text(`Rs.${itemTotal.toFixed(2)}`, 200, yPos, { align: 'right' });
      yPos += Math.max(lines.length * 2.5, 4);
    });
    
    const itemEndY = yPos;
    pdf.line(108, itemEndY, 202, itemEndY);
    pdf.line(108, tableTop + 6, 108, itemEndY);
    pdf.line(115, tableTop + 6, 115, itemEndY);
    pdf.line(163, tableTop + 6, 163, itemEndY);
    pdf.line(173, tableTop + 6, 173, itemEndY);
    pdf.line(188, tableTop + 6, 188, itemEndY);
    pdf.line(195, tableTop + 6, 195, itemEndY);
    pdf.line(202, tableTop + 6, 202, itemEndY);
    
    yPos += 3;
    const pricingStartY = yPos;
    const subtotal = parseFloat(order.subtotal) || 0;
    const discount = parseFloat(order.discount) || 0;
    const deliveryFee = parseFloat(order.deliveryFee) || 0;
    const total = parseFloat(order.total) || 0;
    const deliveryGst = order.deliveryOption?.gst || {};
    const isSameState = deliveryGst.isSameState !== false;
    const gstRate = 5;
    const afterDiscount = subtotal - discount;
    const totalWithDelivery = afterDiscount + deliveryFee;
    const baseAmount = totalWithDelivery / (1 + gstRate / 100);
    const gstAmount = totalWithDelivery - baseAmount;
    const cgstAmount = isSameState ? (gstAmount / 2) : 0;
    const sgstAmount = isSameState ? (gstAmount / 2) : 0;
    const igstAmount = !isSameState ? gstAmount : 0;
    
    pdf.setFont(undefined, 'normal');
    pdf.text('Subtotal (incl. GST):', 118, yPos);
    pdf.text(`Rs.${subtotal.toFixed(2)}`, 200, yPos, { align: 'right' });
    yPos += 3;
    
    if (discount > 0) {
      pdf.text(`Discount (${order.couponCode || ''})`, 118, yPos);
      pdf.text(`- Rs.${discount.toFixed(2)}`, 200, yPos, { align: 'right' });
      yPos += 3;
    }
    
    pdf.text('Delivery Fee (incl. GST):', 118, yPos);
    pdf.text(`Rs.${deliveryFee.toFixed(2)}`, 200, yPos, { align: 'right' });
    yPos += 3;
    
    pdf.text('Taxable Amount:', 118, yPos);
    pdf.text(`Rs.${baseAmount.toFixed(2)}`, 200, yPos, { align: 'right' });
    yPos += 3;
    
    if (isSameState) {
      pdf.text(`CGST (2.50%)`, 118, yPos);
      pdf.text(`Rs.${cgstAmount.toFixed(2)}`, 200, yPos, { align: 'right' });
      yPos += 3;
      pdf.text(`SGST (2.50%)`, 118, yPos);
      pdf.text(`Rs.${sgstAmount.toFixed(2)}`, 200, yPos, { align: 'right' });
      yPos += 3;
    } else {
      pdf.text(`IGST (5.00%)`, 118, yPos);
      pdf.text(`Rs.${igstAmount.toFixed(2)}`, 200, yPos, { align: 'right' });
      yPos += 3;
    }
    
    pdf.setFont(undefined, 'bold');
    pdf.text('TOTAL:', 118, yPos);
    pdf.text(`Rs.${total.toFixed(2)}`, 200, yPos, { align: 'right' });
    
    yPos += 4;
    pdf.text('Amount in Words:', 118, yPos);
    pdf.setFont(undefined, 'normal');
    const amountInWords = convertToWords(total);
    const wordLines = pdf.splitTextToSize(amountInWords, 80);
    pdf.text(wordLines, 118, yPos + 3);
    
    const pricingEndY = yPos + 3 + (wordLines.length * 2.5);
    pdf.rect(108, itemEndY, 94, pricingEndY - itemEndY);
    
    // Authorized Signatory
    let footerY = pricingEndY + 4;
    pdf.setFont(undefined, 'bold');
    pdf.text('For EN3 FASHIONS:', 175, footerY);
    if (signatureUrl) {
      const signatureImg = new Image();
      signatureImg.src = signatureUrl;
      try {
        pdf.addImage(signatureImg, 'PNG', 175, footerY + 2, 20, 6);
      } catch (e) {}
    }
    pdf.setFont(undefined, 'normal');
    pdf.text('Authorized Signatory', 175, footerY + 10);
    
    // Date & Time
    pdf.setFont(undefined, 'bold');
    pdf.text('Date & Time:', 108, footerY + 10);
    pdf.setFont(undefined, 'normal');
    pdf.text(new Date().toLocaleString('en-GB'), 125, footerY + 10);
    pdf.save(`combined-${order.id}.pdf`);
  };
  
  const convertToWords = (amount) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    
    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);
    
    if (rupees === 0 && paise === 0) return 'Zero only';
    
    let words = '';
    let num = rupees;
    
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
    
    if (rupees > 0) {
      words += 'Rupees ';
    }
    
    if (paise > 0) {
      if (rupees > 0) words += 'and ';
      if (paise >= 20) {
        words += tens[Math.floor(paise / 10)] + ' ';
        if (paise % 10 > 0) words += ones[paise % 10] + ' ';
      } else if (paise >= 10) {
        words += teens[paise - 10] + ' ';
      } else {
        words += ones[paise] + ' ';
      }
      words += 'Paise ';
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
          {row.status !== 'Shipped' && row.status !== 'Cancelled' && (
            <button
              className="action-btn edit"
              title="Edit Order"
              onClick={() => handleEditOrder(row)}
            >
              <Edit size={16} />
            </button>
          )}
          {(row.status === 'Placed' || row.status === 'Shipped' || row.status === 'Delivered') && (
            <button
              className="action-btn download"
              title="Download Combined Document"
              onClick={() => generateCombinedDocument(row)}
            >
              <Receipt size={16} />
            </button>
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
        {/* <div className="stat-card" onClick={() => setStatusFilter("delivered")}>
          <div className="stat-icon delivered">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{statusCounts.delivered}</h3>
            <p>Delivered</p>
          </div>
        </div> */}
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
        {/* <button
          className={statusFilter === "delivered" ? "tab active" : "tab"}
          onClick={() => setStatusFilter("delivered")}
        >
          Delivered
        </button> */}
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
                        {item.sizeVariantId && (
                          <p style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'monospace' }}>
                            Variant ID: {item.sizeVariantId}
                          </p>
                        )}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px', width: '90%' }}>
            <div className="modal-header">
              <h2>Update Order Status - #ORD-{selectedOrder.id}</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ flex: '0 0 200px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                  >
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                {newStatus === 'Shipped' && (
                  <div style={{ flex: '1', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                      📄 Invoice and package slip will be automatically generated and uploaded.
                    </p>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Courier Name (Optional)</label>
                      <input
                        type="text"
                        value={courierName}
                        onChange={(e) => setCourierName(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Tracking ID (Optional)</label>
                      <input
                        type="text"
                        value={trackingId}
                        onChange={(e) => setTrackingId(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500' }}>Tracking Link (Optional)</label>
                      <input
                        type="text"
                        value={trackingLink}
                        onChange={(e) => setTrackingLink(e.target.value)}
                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                )}
                <div style={{ flex: '0 0 150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button 
                    className="btn btn-primary" 
                    onClick={handleUpdateStatus}
                    disabled={uploading}
                    style={{ width: '100%', padding: '15px 20px', marginTop: '20px', fontSize: '14px', fontWeight: '600', borderRadius: '6px', border: 'none', backgroundColor: '#4169E1', color: 'white', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}
                  >
                    {uploading ? 'Uploading...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersList;
