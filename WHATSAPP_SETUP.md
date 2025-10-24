# WhatsApp Business API Setup Guide

## Steps to Configure WhatsApp Business API

### 1. Create Meta Business Account
- Go to https://business.facebook.com
- Create a business account if you don't have one

### 2. Set Up WhatsApp Business API
- Go to https://developers.facebook.com
- Create a new app or select existing app
- Add "WhatsApp" product to your app

### 3. Get Your Credentials

#### Phone Number ID:
1. Go to WhatsApp > API Setup
2. Copy the "Phone number ID" (looks like: 123456789012345)

#### Access Token:
1. In the same page, find "Temporary access token"
2. For production, generate a permanent token:
   - Go to System Users in Business Settings
   - Create a system user
   - Generate a permanent token with `whatsapp_business_messaging` permission

### 4. Configure Your .env File

Update `backend/.env` with your credentials:

```env
WHATSAPP_API_URL="https://graph.facebook.com/v18.0"
WHATSAPP_PHONE_NUMBER_ID="your_phone_number_id_here"
WHATSAPP_ACCESS_TOKEN="your_access_token_here"
```

### 5. Phone Number Format
- Customer phone numbers must include country code
- Format: 919360999351 (without + sign)
- Example: India = 91, US = 1

### 6. Test the Integration
1. Place a test order
2. Check backend console for success/error messages
3. Customer should receive WhatsApp message automatically

## Message Format
```
Hi [Customer Name]
Your order ([Order ID]) is successfully placed!
```

## Troubleshooting

### Message not received?
- Verify phone number format (country code without +)
- Check if phone number is registered on WhatsApp
- Verify access token is valid
- Check backend console for error messages

### API Errors?
- Ensure WhatsApp Business API is approved
- Check rate limits (1000 messages/day for test accounts)
- Verify phone number ID is correct

## Production Checklist
- [ ] Get permanent access token
- [ ] Verify business account
- [ ] Request higher rate limits if needed
- [ ] Add webhook for delivery status (optional)
- [ ] Test with multiple phone numbers
