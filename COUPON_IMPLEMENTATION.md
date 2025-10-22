# Coupon Module Implementation

## Backend (NestJS + Prisma)

### 1. Database Schema
Added two models to `schema.prisma`:
- **Coupon**: Stores coupon details (code, type, value, limits, expiry)
- **CouponUsage**: Tracks per-user coupon usage
- Updated **Order** model to include discount and couponCode fields
- Updated **User** model to include couponUsages relation

### 2. Coupon Module (`backend/src/coupon/`)
- **coupon.service.ts**: Business logic for CRUD and validation
- **coupon.controller.ts**: REST API endpoints
- **coupon.module.ts**: Module configuration
- **dto/create-coupon.dto.ts**: Data transfer object

### 3. API Endpoints
- `POST /coupons` - Create coupon (Admin)
- `GET /coupons` - Get all coupons (Admin)
- `GET /coupons/:id` - Get coupon by ID (Admin)
- `PATCH /coupons/:id` - Update coupon (Admin)
- `DELETE /coupons/:id` - Delete coupon (Admin)
- `POST /coupons/validate` - Validate coupon (User)

### 4. Order Integration
- Updated `order.service.ts` to apply coupons during checkout
- Updated `order.module.ts` to import CouponModule
- Updated `create-order.dto.ts` to include couponCode field

## Admin Panel (React)

### 1. API Layer (`Admin/src/api/couponApi.js`)
Functions for all CRUD operations

### 2. Pages
- **CouponList.jsx**: Display all coupons with search, edit, delete
- **AddCoupon.jsx**: Create new coupon
- **EditCoupon.jsx**: Update existing coupon

### 3. Features
- Generate random coupon codes
- Set percentage or fixed discount
- Min order amount and max discount limits
- Total usage limit and per-user limit
- Expiry date
- Active/Inactive status
- Real-time usage tracking

## Frontend User Panel (React)

### 1. API Layer (`frontend/src/api/couponApi.js`)
- `validateCoupon(code, orderAmount, token)` - Validate and get discount

### 2. Checkout Integration
Users can apply coupons during checkout:
- Enter coupon code
- System validates:
  - Coupon exists and is active
  - Not expired
  - Usage limits not exceeded
  - User hasn't exceeded per-user limit
  - Order meets minimum amount
- Calculates discount
- Applies to order total
- Records usage

## Migration Steps

1. Run Prisma migration:
   ```bash
   cd backend
   npx prisma migrate dev --name add_coupons
   ```

2. Restart backend server

3. Access admin panel to create coupons

4. Users can apply coupons at checkout

## Coupon Validation Rules

1. **Active Status**: Coupon must be active
2. **Expiry**: Must not be expired
3. **Usage Limit**: Total usage < usage limit
4. **Per User Limit**: User usage < per user limit
5. **Min Order**: Order amount >= minimum order amount
6. **Discount Calculation**:
   - Percentage: (amount × value%) capped at maxDiscount
   - Fixed: Direct value deduction
