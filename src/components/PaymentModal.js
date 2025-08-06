import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from './ui/Button';
import { toast } from 'react-toastify';
import apiRequest from '../services/api';
import { DollarSign } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, booking, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);

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

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold mb-3">Payment Method</h3>
          <div className="flex items-center space-x-3 p-3 border rounded-lg bg-green-50 border-green-200">
              <DollarSign className="text-green-600" size={20} />
            <span className="font-medium">Cash Payment</span>
          </div>
        </div>

        {/* Payment Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">Cash Payment Instructions</h4>
            <p className="text-sm text-yellow-700">
              • Payment will be collected upon arrival<br/>
              • Host will confirm payment when received<br/>
            • Booking will be pending until payment is confirmed<br/>
            • Please bring exact amount in cash
            </p>
          </div>

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
          
            <Button
            onClick={handleCashPayment}
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Confirm Cash Payment'}
            </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PaymentModal; 