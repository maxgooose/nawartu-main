# Stripe Integration Setup

## Environment Variables Required

Add these to your `.env` files:

### Backend (.env)
```
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key_here
```

### Frontend (.env.local or .env)
```
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_stripe_publishable_key_here
```

## Current Placeholder Values

The system is currently using placeholder keys:
- Backend: `sk_test_placeholder_key_replace_with_real_key`
- Frontend: `pk_test_placeholder_key_replace_with_real_key`

## How to Get Stripe Keys

1. Create a Stripe account at https://stripe.com
2. Go to Developers > API keys
3. Copy your Publishable key (starts with `pk_test_`) and Secret key (starts with `sk_test_`)
4. Replace the placeholder values in your environment files

## Testing

Once you add real Stripe keys, you can test with these card numbers:
- Success: 4242 4242 4242 4242
- Decline: 4000 0000 0000 0002
- Requires authentication: 4000 0025 0000 3155

Use any future date for expiry and any 3-digit CVC.