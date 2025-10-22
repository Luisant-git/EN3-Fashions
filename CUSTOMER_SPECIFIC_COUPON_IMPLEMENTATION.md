# Customer-Specific Coupon Implementation

## Overview
This feature allows admins to create coupons that are specific to individual customers. Customers can be selected by searching their phone number in the admin panel.

## Features
- ✅ Optional customer-specific coupons
- ✅ Searchable dropdown to select customers by phone number
- ✅ General coupons available to all users (when no customer is selected)
- ✅ Customer-specific coupons only visible to assigned customers
- ✅ Visual indicator in coupon list showing customer-specific coupons

## Backend Changes

### 1. Database Schema (schema.prisma)
- Added `specificUserId` field to Coupon model (optional)
- Added relation `specificUser` to User model
- Added `specificCoupons` relation in User model
- Added index on `specificUserId` for performance

### 2. DTO Updates (create-coupon.dto.ts)
- Added `specificUserId?: number` field

### 3. Service Updates (coupon.service.ts)
- Updated `findAll()` to include specificUser details
- Updated `validateCoupon()` to check if coupon is customer-specific
- Updated `getActiveCoupons()` to filter coupons by userId (shows only general + user-specific coupons)

### 4. Controller Updates (coupon.controller.ts)
- Updated `getActiveCoupons()` to pass userId for filtering

### 5. Customer Service (customer.service.ts)
- Added `searchByPhone()` method for customer lookup

### 6. Customer Controller (customer.controller.ts)
- Added `GET /customer/search/phone` endpoint

## Admin Frontend Changes

### 1. API Updates (couponApi.js)
- Added `searchCustomersByPhone()` function

### 2. AddCoupon Component
- Added customer search input with dropdown
- Added debounced search (300ms delay)
- Added customer selection functionality
- Added clear customer button
- Added visual feedback for selected customer
- Added hint text explaining optional nature

### 3. EditCoupon Component
- Same features as AddCoupon
- Pre-populates selected customer when editing

### 4. CouponList Component
- Added "Customer" column showing customer name and phone
- Added customer badge (👤) icon for customer-specific coupons
- Shows "All" for general coupons

### 5. Styles (add-coupon.scss)
- Added `.customer-search-wrapper` styles
- Added `.customer-dropdown` styles with hover effects
- Added `.selected-customer-info` styles
- Added `.customer-badge` styles
- Added `.clear-customer-btn` styles

## How It Works

### Creating a Customer-Specific Coupon:
1. Admin goes to Add Coupon page
2. Fills in coupon details
3. (Optional) Types phone number in "Customer Specific" field
4. Dropdown shows matching customers
5. Admin selects a customer
6. Coupon is created with `specificUserId`

### Creating a General Coupon:
1. Admin goes to Add Coupon page
2. Fills in coupon details
3. Leaves "Customer Specific" field empty
4. Coupon is created without `specificUserId` (available to all)

### Customer Experience:
- When fetching active coupons, API returns:
  - All general coupons (specificUserId = null)
  - Coupons specific to that customer (specificUserId = customer's ID)
- When validating a coupon:
  - If coupon is customer-specific, validates that userId matches
  - Returns error if customer tries to use someone else's coupon

## API Endpoints

### New/Updated Endpoints:

#### GET /customer/search/phone
Search customers by phone number
- Query: `phone` (string, min 3 characters)
- Returns: Array of customers with id, name, phone, email

#### GET /coupons/active
Get active coupons for a user (requires authentication)
- Returns: Coupons available to the authenticated user

## Database Migration

Run the following command to apply schema changes:
```bash
cd backend
npx prisma migrate dev --name add-customer-specific-coupons
npx prisma generate
```

## Testing

### Test Scenarios:

1. **Create General Coupon**
   - Leave customer field empty
   - Verify coupon appears for all users

2. **Create Customer-Specific Coupon**
   - Search and select a customer
   - Verify coupon only appears for that customer

3. **Edit Coupon**
   - Edit existing coupon
   - Change customer assignment
   - Verify changes are saved

4. **Customer Search**
   - Type phone number
   - Verify dropdown shows matching customers
   - Verify selection works

5. **Coupon Validation**
   - Try using customer-specific coupon with wrong user
   - Verify error message appears

## Security Considerations
- Customer search requires admin authentication
- Coupon validation checks userId match for customer-specific coupons
- Phone search is limited to 10 results to prevent data leakage

## Future Enhancements
- Bulk assign coupons to multiple customers
- Customer groups for coupon assignment
- Email notification when customer-specific coupon is created
- Coupon usage history per customer
