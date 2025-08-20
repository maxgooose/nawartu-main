import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import apiRequest from '../services/api';
import { 
  X, Star, MapPin, Calendar, Users, Clock, 
  CheckCircle, CreditCard, Shield, Banknote,
  Sparkles, Zap, Crown, Gem
} from 'lucide-react';

// Initialize Stripe with placeholder key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder_key_replace_with_real_key');

const PaymentForm = ({ booking, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [processing, setProcessing] = useState(false);

  const handleCardPayment = async () => {
    if (!stripe || !elements) return;
    toast.error('Stripe not loaded');
    setProcessing(false);
  };

  const handleCashPayment = async () => {
    setProcessing(true);
    try {
      const response = await apiRequest('/api/payments/cash', 'POST', {
        bookingId: booking._id
      });

      toast.success('Cash booking confirmed! Pay cash upon arrival.');
      onSuccess(response.booking, response.confirmationCode);
    } catch (error) {
      console.error('Cash payment error:', error);
      toast.error('Failed to process cash booking. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (paymentMethod === 'card') {
      await handleCardPayment();
    } else {
      await handleCashPayment();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-serif font-bold">Complete Your Luxury Stay</h3>
            <p className="text-white/80 mt-1">Secure payment processing</p>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Property Summary */}
        <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-xl p-6 mb-8 border border-amber-200/30">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 via-orange-400 to-red-400 rounded-lg flex items-center justify-center">
              <Star className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-serif font-bold text-slate-800 mb-2">{booking.property?.title}</h4>
              <div className="text-sm text-slate-600">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span>{booking.property?.location?.address}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-amber-500" />
                  <span>{new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-500" />
                  <span>{booking.guests} guests</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-amber-200/30">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-slate-700">Total Amount</span>
              <span className="text-3xl font-serif font-bold text-amber-600">${booking.totalPrice}</span>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">Choose Payment Method</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === 'cash' 
                ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                : 'border-slate-200 hover:border-emerald-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Banknote className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Pay with Cash</div>
                  <div className="text-sm text-slate-600 mt-1">Pay directly to host upon arrival</div>
                </div>
              </div>
            </label>

            <label className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              paymentMethod === 'card' 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : 'border-slate-200 hover:border-blue-300'
            }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">Pay with Card</div>
                  <div className="text-sm text-slate-600 mt-1">Secure payment with Stripe</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Card Details */}
        {paymentMethod === 'card' && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-slate-800 mb-3">Card Information</label>
            <div className="border-2 border-slate-300 rounded-xl p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#2F2F2F',
                      fontFamily: 'Inter, sans-serif',
                      '::placeholder': {
                        color: '#94A3B8',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={processing}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
            processing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {processing ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            paymentMethod === 'card' ? `Pay $${booking.totalPrice}` : 'Confirm Booking'
          )}
        </button>
      </div>
    </div>
  );
};

const PaymentModal = ({ booking, isOpen, onClose, onSuccess }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <motion.div 
            className="fixed inset-0 bg-black/20" 
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div 
            className="relative w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Elements stripe={stripePromise}>
              <PaymentForm
                booking={booking}
                onSuccess={onSuccess}
                onCancel={onClose}
              />
            </Elements>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;