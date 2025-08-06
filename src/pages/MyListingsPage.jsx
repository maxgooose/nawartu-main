import React, { useState, useEffect, useContext } from 'react';
import apiRequest from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const MyListingsPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const fetchListings = async () => {
        try {
          // Try host-specific endpoint first, fall back to user properties
          let data;
          try {
            data = await apiRequest(`/api/host/properties/bulk`);
          } catch (hostErr) {
            // If host endpoint fails, try user properties endpoint
            data = await apiRequest(`/api/users/${user.id}/properties`);
          }
          setListings(data);
        } catch (err) {
          console.error('Failed to load listings:', err);
          toast.error('Failed to load listings');
        } finally {
          setLoading(false);
        }
      };
      fetchListings();
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await apiRequest(`/api/properties/${id}`, 'DELETE');
        setListings(listings.filter(l => l._id !== id));
        toast.success('Listing deleted');
      } catch (err) {
        toast.error('Failed to delete listing');
      }
    }
  };

  const handleBecomeHost = async () => {
    try {
      const data = await apiRequest('/api/auth/become-host', 'POST');
      toast.success('You are now a host!');
      // Update user context
      window.location.reload(); // Simple refresh to update user role
    } catch (err) {
      toast.error('Failed to become a host');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">My Listings</h1>
        {user && (user.role === 'host' || user.role === 'admin') && (
          <Link to="/host/dashboard">
            <Button className="bg-green-600 hover:bg-green-700">
              📊 Host Dashboard
            </Button>
          </Link>
        )}
      </div>
      
      {/* Show become host button if user is not a host */}
      {user && user.role === 'user' && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold mb-2">Become a Host</h2>
          <p className="text-gray-600 mb-3">Start hosting and earn money by listing your property.</p>
          <Button onClick={handleBecomeHost} className="bg-blue-600 hover:bg-blue-700">
            Become a Host
          </Button>
        </div>
      )}
      
      {listings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">You have no listings.</p>
          {user && (user.role === 'host' || user.role === 'admin') && (
            <p className="mt-2">
              <Link to="/" className="text-blue-500 hover:underline">Create your first listing</Link>
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {listings.map(l => (
            <div key={l._id} className="border p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={l.images && l.images[0] ? l.images[0] : '/placeholder-image.svg'} 
                  alt={l.title} 
                  className="w-24 h-24 object-cover rounded"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.svg';
                  }}
                />
                <div>
                  <h2 className="font-semibold">{l.title}</h2>
                  <p className="text-green-600 font-medium">${l.price}/night</p>
                  {l.stats && (
                    <p className="text-sm text-gray-500">
                      {l.stats.totalBookings} bookings • {l.stats.activeBookings} active
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(l._id)}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListingsPage; 