# GauChara Backend

Node.js/Express backend API for the GauChara website.

## Features

- 📧 **Contact Form API** - With email notifications and validation
- 💳 **Donation Processing** - Stripe integration for payments
- 🤖 **Chatbot API** - Intelligent response system
- 🔒 **Security** - Helmet, CORS, rate limiting, input validation
- 🛡️ **XSS/CSRF Protection** - Input sanitization

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Set `FRONTEND_URL` to your frontend URL
- Add SMTP credentials for email notifications
- Add Stripe keys for payment processing

### 3. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
```

### Contact Form
```
POST /api/contact
Body: { name, email, subject, message }
```

### Donations
```
POST /api/donation/create-payment-intent
Body: { amount, currency, name, email, paymentMethod }

POST /api/donation/confirm
Body: { donationId, transactionId, paymentMethod }

GET /api/donation/bank-details
GET /api/donation/stats
```

### Chatbot
```
POST /api/chat
Body: { message }

GET /api/chat/quick-replies
```

## Connecting Frontend to Backend

1. Update the frontend API base URL in `src/lib/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

2. For production, update to your deployed backend URL:
   ```typescript
   const API_BASE_URL = 'https://your-backend-domain.com/api';
   ```

## Deployment Options

### Option 1: Railway
```bash
railway login
railway init
railway up
```

### Option 2: Render
1. Connect GitHub repo
2. Set environment variables
3. Deploy

### Option 3: DigitalOcean App Platform
1. Create app from GitHub
2. Configure environment
3. Deploy

### Option 4: Self-hosted (VPS)
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name gauchara-api
pm2 save
pm2 startup
```

## Security Notes

- All inputs are validated and sanitized
- Rate limiting prevents abuse (100 requests/15 min)
- Helmet adds security headers
- CORS restricts origins
- Sensitive data is never logged
