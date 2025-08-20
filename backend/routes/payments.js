const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const stripeService = require('../services/stripe');
const Booking = require('../models/Booking');
const Property = require('../models/Property');
const User = require('../models/User');
const { sendBookingConfirmationToGuest, sendBookingNotificationToHost } = require('../services/email');

const router = express.Router();

// Create Stripe payment intent for card payments
router.post('/stripe/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('guest')
      .populate('host');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.guest._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const paymentIntent = await stripeService.createPaymentIntent(
      booking.totalPrice,
      'usd',
      {
        bookingId: booking._id.toString(),
        guestId: booking.guest._id.toString(),
        propertyId: booking.property._id.toString()
      }
    );

    // Store the payment intent ID for later confirmation
    booking.paymentDetails = {
      ...booking.paymentDetails,
      stripePaymentIntentId: paymentIntent.paymentIntentId
    };
    await booking.save();

    res.json({
      clientSecret: paymentIntent.clientSecret,
      paymentIntentId: paymentIntent.paymentIntentId,
      booking
    });
  } catch (error) {
    console.error('Create Stripe payment intent error:', error);
    res.status(500).json({ message: 'Failed to create payment intent' });
  }
});

// Confirm Stripe payment
router.post('/stripe/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('guest')
      .populate('host');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.guest._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const paymentResult = await stripeService.confirmPaymentIntent(paymentIntentId);

    if (paymentResult.success) {
      booking.paymentStatus = 'paid';
      booking.paymentMethod = 'card';
      booking.status = 'confirmed';
      booking.paymentDetails = {
        stripePaymentIntentId: paymentIntentId,
        stripeChargeId: paymentResult.chargeId,
        last4: paymentResult.last4,
        cardBrand: paymentResult.cardBrand,
        transactionId: paymentResult.chargeId
      };
      await booking.save();

      // Send confirmation emails immediately
      await sendBookingConfirmationToGuest(booking, booking.guest, booking.property);
      await sendBookingNotificationToHost(booking, booking.host, booking.property, booking.guest);

      res.json({
        message: 'Payment confirmed successfully',
        booking,
        confirmationCode: booking.confirmationCode
      });
    } else {
      res.status(400).json({ 
        message: 'Payment confirmation failed',
        error: paymentResult.error 
      });
    }
  } catch (error) {
    console.error('Confirm Stripe payment error:', error);
    res.status(500).json({ message: 'Failed to confirm payment' });
  }
});

// Process cash payment
router.post('/cash', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('guest')
      .populate('host');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.guest._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.paymentStatus = 'pending';
    booking.paymentMethod = 'cash';
    booking.status = 'confirmed'; // Confirm booking immediately for cash payments
    await booking.save();

    // Send confirmation emails immediately for cash bookings too
    await sendBookingConfirmationToGuest(booking, booking.guest, booking.property);
    await sendBookingNotificationToHost(booking, booking.host, booking.property, booking.guest);

    res.json({
      message: 'Cash payment booking confirmed successfully',
      booking,
      confirmationCode: booking.confirmationCode
    });
  } catch (error) {
    console.error('Cash payment error:', error);
    res.status(500).json({ message: 'Failed to process cash payment' });
  }
});

// Mark cash payment as received (for host)
router.post('/cash/received', authenticateToken, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('property')
      .populate('guest')
      .populate('host');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.host._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only host can mark cash as received' });
    }

    if (booking.paymentMethod !== 'cash') {
      return res.status(400).json({ message: 'This booking is not a cash payment' });
    }

    booking.paymentStatus = 'paid';
    await booking.save();

    res.json({
      message: 'Cash payment marked as received',
      booking
    });
  } catch (error) {
    console.error('Mark cash received error:', error);
    res.status(500).json({ message: 'Failed to mark cash as received' });
  }
});

// Get payment status
router.get('/status/:bookingId', authenticateToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('property')
      .populate('guest')
      .populate('host');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isGuest = booking.guest._id.toString() === req.user._id.toString();
    const isHost = booking.host._id.toString() === req.user._id.toString();

    if (!isGuest && !isHost) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      paymentStatus: booking.paymentStatus,
      paymentMethod: booking.paymentMethod,
      confirmationCode: booking.confirmationCode,
      booking
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
});

// Refund payment (admin only)
router.post('/refund', authenticateToken, async (req, res) => {
  try {
    const { bookingId, amount } = req.body;

    // Check if user is admin (you might want to add this to middleware)
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentMethod === 'card' && booking.paymentDetails.stripeChargeId) {
      const refundResult = await stripeService.refundPayment(
        booking.paymentDetails.stripeChargeId,
        amount
      );

      if (refundResult.success) {
        booking.paymentStatus = 'refunded';
        await booking.save();

        res.json({
          message: 'Refund processed successfully',
          refundId: refundResult.refundId,
          amount: refundResult.amount
        });
      } else {
        res.status(400).json({ message: 'Refund failed' });
      }
    } else if (booking.paymentMethod === 'cash') {
      booking.paymentStatus = 'refunded';
      await booking.save();
      
      res.json({
        message: 'Cash booking marked as refunded',
        booking
      });
    } else {
      res.status(400).json({ message: 'Cannot refund this payment' });
    }
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({ message: 'Failed to process refund' });
  }
});

module.exports = router;