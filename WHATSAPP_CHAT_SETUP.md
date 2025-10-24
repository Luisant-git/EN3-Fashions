# WhatsApp Chat Setup Guide

## Setup Steps

### 1. Database Migration
Stop your backend server, then run:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 2. Configure Meta Webhook

1. Go to https://developers.facebook.com/apps
2. Select your app → WhatsApp → Configuration
3. Click "Edit" on Webhook
4. Enter:
   - **Callback URL**: `https://your-domain.com/whatsapp/webhook`
   - **Verify Token**: `your_verify_token_123` (same as in .env)
5. Subscribe to: `messages`

### 3. Expose Local Server (For Testing)

Use ngrok to expose your local server:
```bash
ngrok http 4062
```

Copy the ngrok URL (e.g., `https://abc123.ngrok.io`) and use it as webhook URL:
`https://abc123.ngrok.io/whatsapp/webhook`

### 4. Restart Backend
```bash
npm run start:dev
```

### 5. Access WhatsApp Chat

In Admin Panel:
- Click **"WhatsApp Chat"** in sidebar
- You'll see all customer messages
- Click on a chat to reply

## How It Works

1. **Customer places order** → Receives WhatsApp template message
2. **Customer replies** → Message stored in database via webhook
3. **Admin sees message** → In WhatsApp Chat page
4. **Admin replies** → Message sent to customer via API

## Testing

1. Place a test order with your phone number
2. Reply to the WhatsApp message
3. Check Admin Panel → WhatsApp Chat
4. Reply from admin panel
5. Check your WhatsApp for admin's reply

## Troubleshooting

- **Messages not appearing?** Check webhook is configured correctly
- **Can't send messages?** Verify access token is valid
- **Webhook verification failed?** Check WHATSAPP_VERIFY_TOKEN matches
