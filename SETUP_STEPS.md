# Setup Steps for Customer-Specific Coupon Feature

## Quick Start Guide

### Step 1: Apply Database Migration
```bash
cd backend
npx prisma migrate dev --name add-customer-specific-coupons
npx prisma generate
```

### Step 2: Restart Backend Server
```bash
# Stop the current backend server (Ctrl+C)
npm run start:dev
```

### Step 3: Restart Admin Frontend (if running)
```bash
cd Admin
# Stop the current server (Ctrl+C)
npm run dev
```

### Step 4: Test the Feature

#### In Admin Panel:
1. Navigate to "Add Coupon" page
2. Fill in coupon details
3. (Optional) Search for a customer by phone number in "Customer Specific" field
4. Select a customer from dropdown or leave empty for general coupon
5. Save the coupon

#### Verify in Coupon List:
- Customer-specific coupons show customer name and phone
- General coupons show "All"
- Customer badge (👤) appears for customer-specific coupons

## Files Modified

### Backend:
- ✅ `backend/prisma/schema.prisma` - Added specificUserId field
- ✅ `backend/src/coupon/dto/create-coupon.dto.ts` - Added specificUserId
- ✅ `backend/src/coupon/coupon.service.ts` - Updated validation and filtering
- ✅ `backend/src/coupon/coupon.controller.ts` - Updated getActiveCoupons
- ✅ `backend/src/customer/customer.service.ts` - Added searchByPhone
- ✅ `backend/src/customer/customer.controller.ts` - Added search endpoint

### Admin Frontend:
- ✅ `Admin/src/api/couponApi.js` - Added searchCustomersByPhone
- ✅ `Admin/src/pages/AddCoupon.jsx` - Added customer search dropdown
- ✅ `Admin/src/pages/EditCoupon.jsx` - Added customer search dropdown
- ✅ `Admin/src/pages/CouponList.jsx` - Added customer column and badge
- ✅ `Admin/src/styles/pages/add-coupon.scss` - Added dropdown styles

## Troubleshooting

### Migration Issues:
If migration fails, try:
```bash
npx prisma migrate reset
npx prisma migrate dev --name add-customer-specific-coupons
```

### TypeScript Errors:
Regenerate Prisma client:
```bash
npx prisma generate
```

### Dropdown Not Showing:
- Check browser console for errors
- Verify backend is running
- Check that customer search endpoint is accessible

## Feature Usage

### Creating General Coupon (Available to All):
- Leave "Customer Specific" field empty
- Coupon will be available to all users

### Creating Customer-Specific Coupon:
1. Type phone number (minimum 3 digits)
2. Wait for dropdown to appear
3. Click on customer to select
4. Customer name and phone will be displayed
5. Click X button to clear selection if needed

### Editing Coupons:
- Existing customer assignment is pre-loaded
- Can change or remove customer assignment
- Can convert general coupon to customer-specific and vice versa

## Notes
- Customer search requires minimum 3 characters
- Search has 300ms debounce to reduce API calls
- Maximum 10 results shown in dropdown
- Customer-specific coupons are validated on checkout
- Users cannot use coupons assigned to other customers
