# WhatsApp Order Notifications Setup

## Overview
WhatsApp notifications are automatically sent when order status changes:
- **Placed** → `order_status_en3` template
- **Shipped** → `order_shipped_utility_en3` template  
- **Delivered** → `order_delivered_invoice` template

## Template Details

### 1. Order Placed - `order_status_en3`
**Triggered:** When order is created
**Parameters:**
1. Customer name (e.g., "Arun")
2. Order ID (e.g., "1234")
3. Total amount (e.g., "₹1250")
4. Payment method (e.g., "razorpay")

**Message Format:**
```
Hi {name},

Your order {orderId} has been placed successfully with EN3 Fashions.

Amount: ₹{amount}
Payment Mode: {paymentMethod}

We will notify you as soon as your order is shipped.
Thank you for shopping with us!
```

### 2. Order Shipped - `order_shipped_utility_en3`
**Triggered:** When admin updates status to "Shipped"
**Parameters:**
1. Customer name (e.g., "Arun")
2. Order ID (e.g., "1234")
3. Courier name (e.g., "Blue Dart")
4. Tracking ID (e.g., "1234")
5. Tracking URL (e.g., "https://tracking.bluedart.com/123456")

**Message Format:**
```
Your order has been shipped

Hi {name},

Your order {orderId} has been shipped.

Courier: {courier}
Tracking ID: {trackingId}
Track your shipment: {trackingUrl}

Thanks...
```

### 3. Order Delivered - `order_delivered_invoice`
**Triggered:** When admin updates status to "Delivered"
**Parameters:**
1. Customer name (e.g., "Arun")
2. Order ID (e.g., "1234")
3. Total amount (e.g., "₹12650")
4. Payment mode (e.g., "Razorpay")
5. Invoice URL (e.g., "https://en3fashion.api.luisant.cloud/uploads/invoice-11.pdf")

**Message Format:**
```
Hi {name}, your order {orderId} has been successfully delivered.

Amount: ₹{amount}
Payment mode: {paymentMode}

You can download your invoice here: {invoiceUrl}

Thank you for shopping with us.
```

## How to Use (Admin Panel)

### Updating Order to Shipped
1. Go to Orders List
2. Click Edit button on the order
3. Select "Shipped" status
4. Fill in tracking information:
   - **Courier:** e.g., "Blue Dart"
   - **Tracking ID:** e.g., "1234"
   - **Tracking URL:** e.g., "https://tracking.bluedart.com/123456"
5. Click "Update Status"
6. WhatsApp message will be sent automatically

### Updating Order to Delivered
1. Go to Orders List
2. Click Edit button on the order
3. Select "Delivered" status
4. Fill in invoice information:
   - **Invoice URL:** e.g., "https://en3fashion.api.luisant.cloud/uploads/invoice-11.pdf"
5. Click "Update Status"
6. WhatsApp message will be sent automatically

## Backend Changes

### Files Modified:
1. **whatsapp.service.ts**
   - Updated `sendOrderConfirmation()` to use `order_status_en3` template
   - Added `sendOrderShipped()` method
   - Added `sendOrderDelivered()` method

2. **order.service.ts**
   - Updated `updateOrderStatus()` to trigger WhatsApp notifications

3. **order.controller.ts**
   - Updated to accept tracking info and invoice URL

4. **update-order-status.dto.ts**
   - Added optional `trackingInfo` field
   - Added optional `invoiceUrl` field

## Frontend Changes

### Files Modified:
1. **OrdersList.jsx**
   - Added state for tracking info and invoice URL
   - Added UI fields in edit modal for Shipped status
   - Added UI fields in edit modal for Delivered status
   - Updated `handleUpdateStatus()` to send tracking/invoice data

2. **order.js (API)**
   - Updated `updateOrderStatus()` to accept full payload

## API Endpoint

**PATCH** `/orders/:orderId/status`

**Request Body:**
```json
{
  "status": "Shipped",
  "trackingInfo": {
    "courier": "Blue Dart",
    "trackingId": "1234",
    "trackingUrl": "https://tracking.bluedart.com/123456"
  }
}
```

OR

```json
{
  "status": "Delivered",
  "invoiceUrl": "https://en3fashion.api.luisant.cloud/uploads/invoice-11.pdf"
}
```

## Testing

1. Create a test order
2. Update status to "Shipped" with tracking info
3. Check WhatsApp for shipped notification
4. Update status to "Delivered" with invoice URL
5. Check WhatsApp for delivered notification

## Notes

- All templates must be approved by WhatsApp before use
- Phone numbers must be in international format (e.g., 919876543210)
- Templates cannot be modified after approval
- If template parameters don't match, message will fail
