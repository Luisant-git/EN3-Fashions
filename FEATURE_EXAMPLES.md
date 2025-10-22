# Customer-Specific Coupon - Feature Examples

## Example 1: Creating a General Coupon

### Admin Panel - Add Coupon Form:
```
Coupon Code: SAVE20
Discount Type: Percentage
Discount Value: 20%
Min Order Amount: ₹500
Customer Specific: [Empty - Leave blank]
```

**Result:** 
- Coupon available to ALL customers
- Shows "All" in Customer column in coupon list

---

## Example 2: Creating a Customer-Specific Coupon

### Admin Panel - Add Coupon Form:
```
Coupon Code: VIP100
Discount Type: Fixed
Discount Value: ₹100
Min Order Amount: ₹1000
Customer Specific: 
  [Type: "9876543210"]
  [Dropdown shows:]
    - Rahul Kumar (9876543210)
    - Priya Sharma (9876543211)
  [Select: Rahul Kumar]
```

**Result:**
- Coupon only available to Rahul Kumar (User ID: 123)
- Shows "Rahul Kumar (9876543210)" in Customer column
- Badge 👤 appears next to coupon code

---

## Example 3: Customer Trying to Use Coupon

### Scenario A: Customer Uses Their Own Coupon
```
Customer: Rahul Kumar (ID: 123)
Coupon Code: VIP100
Result: ✅ Success - Discount applied
```

### Scenario B: Customer Tries Someone Else's Coupon
```
Customer: Priya Sharma (ID: 124)
Coupon Code: VIP100
Result: ❌ Error - "This coupon is not available for your account"
```

### Scenario C: Customer Uses General Coupon
```
Customer: Any customer
Coupon Code: SAVE20
Result: ✅ Success - Discount applied (available to all)
```

---

## Example 4: Fetching Active Coupons

### For Rahul Kumar (ID: 123):
**API Response:**
```json
[
  {
    "code": "SAVE20",
    "type": "percentage",
    "value": 20,
    "minOrderAmount": 500
  },
  {
    "code": "VIP100",
    "type": "fixed",
    "value": 100,
    "minOrderAmount": 1000
  }
]
```
*Shows both general coupon (SAVE20) and his specific coupon (VIP100)*

### For Priya Sharma (ID: 124):
**API Response:**
```json
[
  {
    "code": "SAVE20",
    "type": "percentage",
    "value": 20,
    "minOrderAmount": 500
  }
]
```
*Shows only general coupon (SAVE20), not Rahul's VIP100*

---

## Example 5: Admin Coupon List View

```
┌─────────────────────────────────────────────────────────────────────────┐
│ Coupon Code      │ Type       │ Discount │ Customer              │ Status│
├─────────────────────────────────────────────────────────────────────────┤
│ 👤 VIP100        │ Fixed      │ ₹100     │ Rahul Kumar           │ Active│
│                  │            │          │ (9876543210)          │       │
├─────────────────────────────────────────────────────────────────────────┤
│ SAVE20           │ Percentage │ 20%      │ All                   │ Active│
├─────────────────────────────────────────────────────────────────────────┤
│ 👤 FIRST50       │ Fixed      │ ₹50      │ Priya Sharma          │ Active│
│                  │            │          │ (9876543211)          │       │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Example 6: Editing a Coupon

### Before Edit:
```
Coupon Code: VIP100
Customer: Rahul Kumar (9876543210)
```

### Admin Changes:
1. Clicks X button to clear customer
2. Searches for "9876543211"
3. Selects "Priya Sharma"
4. Saves

### After Edit:
```
Coupon Code: VIP100
Customer: Priya Sharma (9876543211)
```

**Result:**
- Rahul can no longer use VIP100
- Priya can now use VIP100

---

## Example 7: Converting Between General and Specific

### General → Customer-Specific:
```
Before: SAVE20 (Available to All)
Action: Search and select customer "Rahul Kumar"
After: SAVE20 (Only for Rahul Kumar)
```

### Customer-Specific → General:
```
Before: VIP100 (Only for Rahul Kumar)
Action: Click X to clear customer selection
After: VIP100 (Available to All)
```

---

## Use Cases

### 1. Welcome Coupon for New Customer
```
Code: WELCOME50
Customer: New customer (searched by phone)
Discount: ₹50 off
Purpose: First-time purchase incentive
```

### 2. Loyalty Reward for VIP Customer
```
Code: VIP200
Customer: High-value customer
Discount: ₹200 off on ₹2000+
Purpose: Reward loyal customers
```

### 3. Apology Coupon for Service Issue
```
Code: SORRY100
Customer: Customer who had issue
Discount: ₹100 off
Purpose: Compensate for poor experience
```

### 4. Birthday Special
```
Code: BDAY25
Customer: Customer celebrating birthday
Discount: 25% off
Purpose: Birthday gift
```

### 5. General Promotional Coupon
```
Code: SALE30
Customer: [Empty - All customers]
Discount: 30% off on ₹1000+
Purpose: Site-wide sale
```

---

## Admin Workflow

1. **Receive Request:** Customer service receives request for special discount
2. **Open Admin Panel:** Navigate to Add Coupon
3. **Search Customer:** Type customer's phone number
4. **Select Customer:** Click on customer from dropdown
5. **Set Discount:** Configure coupon details
6. **Save:** Create customer-specific coupon
7. **Notify Customer:** Inform customer about their special coupon code

---

## Customer Workflow

1. **Receive Coupon:** Customer gets coupon code (SMS/Email/Call)
2. **Shop:** Add items to cart
3. **Checkout:** Enter coupon code
4. **Validation:** System checks if coupon is valid for this customer
5. **Apply Discount:** Discount applied if valid
6. **Complete Order:** Customer completes purchase with discount
