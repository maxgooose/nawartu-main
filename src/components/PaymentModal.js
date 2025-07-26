import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Button } from './ui/Button';
import { toast } from 'react-toastify';
import apiRequest from '../services/api';
import { CreditCard, DollarSign } from 'lucide-react';
import { useCallback } from 'react';

const PaymentModal = ({ isOpen, onClose, booking, onPaymentComplete }) => {
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [loading, setLoading] = useState(false);
  const [paypalOrderId, setPaypalOrderId] = useState(null);

  const handlePayPalPayment = useCallback(async () => {
    if (!booking || paypalOrderId) return;
    setLoading(true);
    try {
      const { orderID } = await apiRequest('/api/payments/paypal/create-order', 'POST', {
        bookingId: booking._id,
      });
      setPaypalOrderId(orderID);
      window.paypal
        .Buttons({
          createOrder: (data, actions) => orderID,
          onApprove: async (data, actions) => {
            const capture = await apiRequest('/api/payments/paypal/capture', 'POST', {
              orderID: data.orderID,
              bookingId: booking._id,
            });
            onPaymentComplete(capture.booking);
            toast.success('Payment completed successfully!');
          },
          onError: (err) => {
            toast.error('An error occurred during the PayPal transaction.');
            console.error('PayPal error:', err);
          },
        })
        .render('#paypal-button-container');
    } catch (error) {
      toast.error(error.message || 'Failed to create PayPal order');
    } finally {
      setLoading(false);
    }
  }, [booking, onPaymentComplete, paypalOrderId]);

  const handleCashPayment = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/payments/cash', 'POST', {
        bookingId: booking._id
      });

      toast.success('Cash payment request sent! Host will confirm when payment is received.');
      onPaymentComplete(data.booking);
      onClose();
    } catch (error) {
      toast.error('Failed to process cash payment: ' + error.message);
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'paypal') {
      await handlePayPalPayment();
    } else if (paymentMethod === 'cash') {
      await handleCashPayment();
    }
  };

  useEffect(() => {
    if (isOpen && paymentMethod === 'paypal' && !paypalOrderId) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.REACT_APP_PAYPAL_CLIENT_ID}`;
      script.async = true;
      script.onload = () => {
        handlePayPalPayment();
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isOpen, paymentMethod, paypalOrderId, handlePayPalPayment]);

  if (!booking) return null;

  const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Complete Payment">
      <div className="space-y-6">
        {/* Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Booking Summary</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Property:</strong> {booking.property?.title}</p>
            <p><strong>Check-in:</strong> {new Date(booking.checkIn).toLocaleDateString()}</p>
            <p><strong>Check-out:</strong> {new Date(booking.checkOut).toLocaleDateString()}</p>
            <p><strong>Nights:</strong> {nights}</p>
            <p><strong>Guests:</strong> {booking.guests}</p>
            <p className="text-lg font-bold text-green-600">
              <strong>Total:</strong> ${booking.totalPrice}
            </p>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <h3 className="font-semibold mb-3">Select Payment Method</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-blue-600"
              />
              <CreditCard className="text-blue-600" size={20} />
              <span>PayPal</span>
            </label>

            <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === 'cash'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-green-600"
              />
              <DollarSign className="text-green-600" size={20} />
              <span>Cash Payment</span>
            </label>
          </div>
        </div>

        {/* Payment Instructions */}
        {paymentMethod === 'cash' && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Cash Payment Instructions</h4>
            <p className="text-sm text-yellow-700">
              • Payment will be collected upon arrival<br/>
              • Host will confirm payment when received<br/>
              • Booking will be pending until payment is confirmed
            </p>
          </div>
        )}

        {/* PayPal Button Container */}
        {paymentMethod === 'paypal' && (
          <div>
            <div id="paypal-button-container"></div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          
          {paymentMethod === 'cash' && (
            <Button
              onClick={handlePayment}
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Cash Payment'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal; 