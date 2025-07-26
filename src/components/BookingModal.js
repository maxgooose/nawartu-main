import React, { useState, useContext } from 'react';
import Modal from './Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from './ui/input';
import { Button } from './ui/Button';
import apiRequest from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';

const BookingModal = ({ isOpen, onClose, propertyId, onBooked }) => {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (checkOut <= checkIn) { setError('Check-out must be after check-in'); return; }
      const body = {
        propertyId,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests,
      };
      // availability check
      const avail = await apiRequest(`/api/bookings/property/${propertyId}/availability?checkIn=${body.checkIn}&checkOut=${body.checkOut}`);
      if(!avail.isAvailable){ setError('Property not available for selected dates'); return; }
      const data = await apiRequest('/api/bookings', 'POST', body);
      setBooking(data.booking);
      setShowPayment(true);
    } catch (err) {
      setError(err.message || 'Booking failed');
    }
  };

  const handlePaymentComplete = (updatedBooking) => {
    onBooked(updatedBooking);
    toast.success('Booking and payment completed!');
    navigate('/trips');
    onClose();
  };

  if (!user) return null; // only for logged in

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book this stay">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">Check-in</label>
            <DatePicker selected={checkIn} onChange={setCheckIn} className="w-full border p-2 rounded" dateFormat="yyyy-MM-dd" />
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">Check-out</label>
            <DatePicker selected={checkOut} onChange={setCheckOut} className="w-full border p-2 rounded" dateFormat="yyyy-MM-dd" />
          </div>
        </div>
        <Input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Guests" />
        <Button type="submit" className="w-full">Continue to Payment</Button>
      </form>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        booking={booking}
        onPaymentComplete={handlePaymentComplete}
      />
    </Modal>
  );
};

export default BookingModal; 