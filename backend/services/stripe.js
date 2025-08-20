const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_key_replace_with_real_key');

class StripeService {
  /**
   * Create a payment intent for card payments
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code (default: 'usd')
   * @param {object} metadata - Additional metadata
   * @returns {object} Payment intent object
   */
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Confirm a payment intent
   * @param {string} paymentIntentId - The payment intent ID
   * @returns {object} Confirmed payment intent
   */
  async confirmPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Extract card details for display
        const paymentMethod = await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method
        );
        
        return {
          success: true,
          paymentIntentId: paymentIntent.id,
          chargeId: paymentIntent.charges.data[0]?.id,
          last4: paymentMethod.card?.last4,
          cardBrand: paymentMethod.card?.brand,
          amount: paymentIntent.amount / 100,
          status: paymentIntent.status
        };
      }

      return {
        success: false,
        status: paymentIntent.status,
        error: 'Payment not completed'
      };
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  /**
   * Refund a payment
   * @param {string} chargeId - The charge ID to refund
   * @param {number} amount - Amount to refund in cents (optional, full refund if not provided)
   * @returns {object} Refund object
   */
  async refundPayment(chargeId, amount = null) {
    try {
      const refundData = { charge: chargeId };
      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }

      const refund = await stripe.refunds.create(refundData);

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        status: refund.status
      };
    } catch (error) {
      console.error('Stripe refund failed:', error);
      throw new Error('Failed to process refund');
    }
  }

  /**
   * Get payment details
   * @param {string} paymentIntentId - The payment intent ID
   * @returns {object} Payment details
   */
  async getPaymentDetails(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      let cardDetails = null;
      if (paymentIntent.payment_method) {
        const paymentMethod = await stripe.paymentMethods.retrieve(
          paymentIntent.payment_method
        );
        cardDetails = {
          last4: paymentMethod.card?.last4,
          brand: paymentMethod.card?.brand,
          exp_month: paymentMethod.card?.exp_month,
          exp_year: paymentMethod.card?.exp_year
        };
      }

      return {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        cardDetails,
        created: new Date(paymentIntent.created * 1000)
      };
    } catch (error) {
      console.error('Failed to get payment details:', error);
      throw new Error('Failed to retrieve payment details');
    }
  }
}

module.exports = new StripeService();