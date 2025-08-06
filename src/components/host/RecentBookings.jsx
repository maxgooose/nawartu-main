import React from 'react';
import { Link } from 'react-router-dom';

const RecentBookings = ({ bookings }) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
        <p className="mt-4 text-gray-500">No recent bookings found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Bookings</h3>
        <ul className="mt-4 space-y-4">
          {bookings.map((booking) => (
            <li key={booking._id} className="flex items-center space-x-4">
              <img
                className="h-10 w-10 rounded-full"
                src={booking.guest.avatar || `https://ui-avatars.com/api/?name=${booking.guest.name}&background=random`}
                alt={booking.guest.name}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{booking.guest.name}</p>
                <Link to={`/property/${booking.property._id}`} className="text-sm text-gray-500 hover:text-gray-700 truncate">
                  {booking.property.title}
                </Link>
              </div>
              <div className="text-sm text-right">
                <p className="font-semibold text-gray-800">${booking.totalPrice.toFixed(2)}</p>
                <p className={`capitalize text-xs px-2 py-1 rounded-full ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecentBookings;
