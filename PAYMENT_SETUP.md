# Payment and Email Setup Guide

## Environment Variables Setup

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# PayPal Configuration
PAYPAL_CLIENT_ID=your_paypal_client_id_here
PAYPAL_CLIENT_SECRET=your_paypal_client_secret_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here

# Frontend URL (for PayPal redirects)
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file in the root directory (frontend) with:

```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_PAYPAL_CLIENT_ID=your_paypal_client_id_here
```

## PayPal Setup

1. **Create PayPal Developer Account:**
   - Go to [PayPal Developer Portal](https://developer.paypal.com/)
   - Sign up for a developer account
   - Create a new app to get your Client ID and Secret

2. **Get Sandbox Credentials:**
   - Use sandbox credentials for testing
   - Switch to live credentials for production

3. **Configure PayPal App:**
   - Set return URL: `http://localhost:3000/payment/success`
   - Set cancel URL: `http://localhost:3000/payment/cancel`

## Email Setup (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account

2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

3. **Use the app password** in your `EMAIL_PASSWORD` environment variable

## Installation

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

4. **Start the Frontend:**
   ```bash
   npm start
   ```

## Features Added

### Payment System
- ✅ PayPal integration with sandbox/live environments
- ✅ Cash payment option with host confirmation
- ✅ Payment status tracking
- ✅ Secure payment processing

### Email Notifications
- ✅ Welcome emails for new users
- ✅ Booking confirmation emails to guests
- ✅ Booking notification emails to hosts
- ✅ Status update emails (confirmed, cancelled, completed)

### Backend API Endpoints
- `POST /api/payments/paypal/create-order` - Create PayPal order
- `POST /api/payments/paypal/capture` - Capture PayPal payment
- `POST /api/payments/cash` - Process cash payment
- `POST /api/payments/cash/confirm` - Host confirms cash payment
- `GET /api/payments/status/:bookingId` - Get payment status

### Frontend Components
- `PaymentModal` - Payment method selection and processing
- Updated `BookingModal` - Integrated with payment flow

## Testing

1. **Test PayPal Payment:**
   - Use PayPal sandbox accounts for testing
   - Create booking and select PayPal payment
   - Complete payment flow

2. **Test Cash Payment:**
   - Create booking and select cash payment
   - Host can confirm payment in their dashboard

3. **Test Email Notifications:**
   - Register new user (welcome email)
   - Create booking (notification emails)
   - Update booking status (status emails)

## Production Deployment

1. **Update Environment Variables:**
   - Use live PayPal credentials
   - Use production MongoDB URI
   - Set `NODE_ENV=production`
   - Update `FRONTEND_URL` to your domain

2. **Email Configuration:**
   - Consider using a professional email service (SendGrid, Mailgun)
   - Update email templates for production

3. **Security:**
   - Use strong JWT secrets
   - Enable HTTPS
   - Set up proper CORS configuration 