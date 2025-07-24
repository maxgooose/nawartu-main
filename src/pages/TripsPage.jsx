import React, { useEffect, useState } from 'react';
import apiRequest from '../services/api';

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await apiRequest('/api/bookings/my-bookings');
        setTrips(data);
      } catch (err) {
        console.error('Failed to load trips', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) return <div className="p-8">Loading trips...</div>;
  if (trips.length === 0) return <div className="p-8">You have no trips yet.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">My Trips</h1>
      {trips.map((trip) => (
        <div key={trip._id} className="border rounded-lg p-4 flex gap-4 items-center">
          <img src={trip.property?.images?.[0] || 'https://picsum.photos/200'} alt={trip.property?.title} className="h-24 w-24 object-cover rounded" />
          <div className="flex-1">
            <h2 className="font-semibold">{trip.property?.title || 'Listing not available'}</h2>
            <p className="text-sm text-gray-500">
              {formatDate(trip.checkIn)} - {formatDate(trip.checkOut)} · {trip.guests} guests
            </p>
          </div>
          <div className="font-semibold">${trip.totalPrice}</div>
        </div>
      ))}
    </div>
  );
};

export default TripsPage; 