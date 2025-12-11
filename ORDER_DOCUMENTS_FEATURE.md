# Order Documents Upload Feature

## Overview
This feature automatically generates and uploads invoice and package slip documents when changing order status from "Placed" to "Shipped". Admins can also optionally enter courier tracking information (courier name, tracking ID, tracking link). All data is stored in the database.

## Changes Made

### 1. Database Schema (backend/prisma/schema.prisma)
- Added `invoiceUrl` (optional String) to Order model
- Added `packageSlipUrl` (optional String) to Order model
- Added `courierName` (optional String) to Order model
- Added `trackingId` (optional String) to Order model
- Added `trackingLink` (optional String) to Order model

### 2. Backend API

#### DTO (backend/src/order/dto/update-order-status.dto.ts)
- Added optional `invoiceUrl` field
- Added optional `packageSlipUrl` field
- Added optional `courierName` field
- Added optional `trackingId` field
- Added optional `trackingLink` field

#### Service (backend/src/order/order.service.ts)
- Updated `updateOrderStatus` method to accept and store invoice, package slip URLs, and courier tracking info

#### Controller (backend/src/order/order.controller.ts)
- Updated `updateOrderStatus` endpoint to pass invoice, package slip URLs, and courier tracking info to service

### 3. Frontend Admin Panel

#### API (Admin/src/api/order.js)
- Updated `updateOrderStatus` to accept optional invoice, package slip URLs, and courier tracking info
- Added `uploadFile` function to upload files to the server

#### OrdersList Component (Admin/src/pages/OrdersList.jsx)
- Added automatic PDF generation for invoice and package slip
- Added courier tracking state management (courierName, trackingId, trackingLink)
- Added automatic upload logic when changing status from "Placed" to "Shipped"
- Updated edit modal to show courier tracking input fields
- Added upload progress indicator

## Usage

1. Admin opens the edit modal for an order with "Placed" status
2. Admin changes status to "Shipped"
3. Three optional input fields appear:
   - Courier Name (e.g., Blue Dart, DTDC)
   - Tracking ID (e.g., 1234567890)
   - Tracking Link (e.g., https://tracking.example.com/...)
4. Admin can optionally fill in courier tracking information
5. When "Update Status" is clicked:
   - Invoice PDF is automatically generated
   - Package slip PDF is automatically generated
   - Both PDFs are uploaded to the server
   - If upload fails, status change is prevented and error is shown
   - If upload succeeds, URLs and courier tracking info are stored in database and status is updated

## Migration Required
Run the following command in the backend directory:
```bash
npx prisma migrate dev --name add_order_documents_and_tracking
npx prisma generate
```

## Notes
- Documents are automatically generated when changing from "Placed" to "Shipped"
- Courier tracking information is optional but recommended for customer tracking
- If document upload fails, the status change is prevented
- Generated PDFs include complete order details, customer info, and items
- Files are stored in the backend/uploads directory
- URLs and tracking info are stored in the database for future reference
- Invoice includes GST details, pricing breakdown, and company information
- Package slip includes shipping address and item details for packing
- Tracking information can be used to send updates to customers
