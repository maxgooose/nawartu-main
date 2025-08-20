import React, { useState, useContext } from 'react';
import Modal from './Modal';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from './ui/input';
import { Button } from './ui/Button';
import { Card } from './ui/card';
import apiRequest from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PaymentModal from './PaymentModal';
import { Calendar, Users, User, Mail, Phone, CreditCard, DollarSign, MapPin } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, propertyId, onBooked, property }) => {
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [step, setStep] = useState(1); // 1: dates/guests, 2: user info, 3: payment
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passportNumber: '',
    identificationType: 'passport'
  });
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Calculate nights and total price
  const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  const totalPrice = property?.price * nights || 0;

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setCheckIn(start);
    setCheckOut(end);
  };

  const handleGuestChange = (type) => {
    if (type === 'add' && guests < 10) {
      setGuests(guests + 1);
    } else if (type === 'subtract' && guests > 1) {
      setGuests(guests - 1);
    }
  };

  const handleUserInfoChange = (field, value) => {
    setUserInfo(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (checkOut <= checkIn) {
        setError('Check-out must be after check-in');
        return;
      }
      if (nights < 1) {
        setError('Please select at least 1 night');
        return;
      }
      setStep(2);
      setError('');
    } else if (step === 2) {
      // Validate user info
      const requiredFields = ['firstName', 'lastName', 'email', 'phone'];
      const missingFields = requiredFields.filter(field => !userInfo[field]);
      if (missingFields.length > 0) {
        setError(`Please fill in: ${missingFields.join(', ')}`);
        return;
      }
      setStep(3);
      setError('');
    }
  };

  const handleSubmit = async () => {
    setError('');
    try {
      // Check availability
      const avail = await apiRequest(`/api/bookings/property/${propertyId}/availability?checkIn=${checkIn.toISOString().split('T')[0]}&checkOut=${checkOut.toISOString().split('T')[0]}`);
      if (!avail.isAvailable) {
        setError('Property not available for selected dates');
        return;
      }

      const body = {
        propertyId,
        checkIn: checkIn.toISOString().split('T')[0],
        checkOut: checkOut.toISOString().split('T')[0],
        guests,
        userInfo
      };

      const data = await apiRequest('/api/bookings', 'POST', body);
      setBooking(data.booking);
      setShowPayment(true);
    } catch (err) {
      setError(err.message || 'Booking failed');
    }
  };

  const handlePaymentComplete = (updatedBooking, confirmationCode) => {
    onBooked(updatedBooking);
    toast.success(`Booking confirmed! Your confirmation code is: ${confirmationCode}`);
    navigate('/trips');
    onClose();
    setShowPayment(false);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Your Luxury Stay">
      <div className="max-w-2xl mx-auto">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step >= stepNumber 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  step > stepNumber ? 'bg-gradient-to-r from-amber-500 to-yellow-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Dates and Guests */}
        {step === 1 && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                Select Your Dates
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-in</label>
                  <DatePicker
                    selected={checkIn}
                    onChange={(date) => setCheckIn(date)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    dateFormat="MMM dd, yyyy"
                    minDate={new Date()}
                    placeholderText="Select check-in date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Check-out</label>
                  <DatePicker
                    selected={checkOut}
                    onChange={(date) => setCheckOut(date)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                    dateFormat="MMM dd, yyyy"
                    minDate={checkIn}
                    placeholderText="Select check-out date"
                  />
                </div>
              </div>

              {nights > 0 && (
                <div className="mt-4 p-4 bg-white rounded-lg border border-slate-200">
                  <p className="text-slate-600">
                    <span className="font-semibold">{nights}</span> night{nights > 1 ? 's' : ''} selected
                  </p>
                </div>
              )}
            </Card>

            <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Number of Guests
              </h3>
              
              <div className="flex items-center justify-center space-x-6">
                <button
                  onClick={() => handleGuestChange('subtract')}
                  className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 hover:border-amber-500 transition-colors flex items-center justify-center text-2xl font-bold text-slate-600 hover:text-amber-600"
                >
                  -
                </button>
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-800">{guests}</div>
                  <div className="text-sm text-slate-600">Guest{guests > 1 ? 's' : ''}</div>
                </div>
                <button
                  onClick={() => handleGuestChange('add')}
                  className="w-12 h-12 rounded-full bg-white border-2 border-slate-300 hover:border-amber-500 transition-colors flex items-center justify-center text-2xl font-bold text-slate-600 hover:text-amber-600"
                >
                  +
                </button>
              </div>
            </Card>

            <Button 
              onClick={handleNextStep} 
              className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Continue to Guest Information
            </Button>
          </div>
        )}

        {/* Step 2: User Information */}
        {step === 2 && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                Guest Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">First Name *</label>
                  <Input
                    type="text"
                    value={userInfo.firstName}
                    onChange={(e) => handleUserInfoChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Last Name *</label>
                  <Input
                    type="text"
                    value={userInfo.lastName}
                    onChange={(e) => handleUserInfoChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
                  <Input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => handleUserInfoChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Phone *</label>
                  <Input
                    type="tel"
                    value={userInfo.phone}
                    onChange={(e) => handleUserInfoChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Identification Type</label>
                <select
                  value={userInfo.identificationType}
                  onChange={(e) => handleUserInfoChange('identificationType', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                >
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="national_id">National ID</option>
                </select>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Identification Number</label>
                <Input
                  type="text"
                  value={userInfo.passportNumber}
                  onChange={(e) => handleUserInfoChange('passportNumber', e.target.value)}
                  placeholder={`Enter ${userInfo.identificationType} number`}
                  className="w-full"
                />
              </div>
            </Card>

            <div className="flex gap-4">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-4 text-lg font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-300"
              >
                Back
              </Button>
              <Button 
                onClick={handleNextStep}
                className="flex-1 py-4 text-lg font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue to Payment
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Summary and Payment */}
        {step === 3 && (
          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-0 shadow-lg">
              <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Booking Summary
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Check-in:</span>
                  <span className="font-semibold text-slate-800">{checkIn.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Check-out:</span>
                  <span className="font-semibold text-slate-800">{checkOut.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Nights:</span>
                  <span className="font-semibold text-slate-800">{nights}</span>
                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Guests:</span>
                  <span className="font-semibold text-slate-800">{guests}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Location:</span>
                  <span className="font-semibold text-slate-800">{property?.location?.address}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                  <span className="text-slate-600">Price per night:</span>
                  <span className="font-semibold text-slate-800">${property?.price}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg px-4">
                  <span className="text-lg font-semibold text-slate-800">Total:</span>
                  <span className="text-2xl font-bold text-amber-600">${totalPrice}</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-4">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex-1 py-4 text-lg font-semibold border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg transition-all duration-300"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1 py-4 text-lg font-semibold bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        booking={booking}
        onSuccess={handlePaymentComplete}
      />
    </Modal>
  );
};

export default BookingModal; 