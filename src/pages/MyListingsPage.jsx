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
          const data = await apiRequest(`/api/users/${user.id}/properties`);
          setListings(data);
        } catch (err) {
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

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">My Listings</h1>
      {listings.length === 0 ? (
        <p>You have no listings. <Link to="/" className="text-blue-500">Create one</Link></p>
      ) : (
        <div className="space-y-4">
          {listings.map(l => (
            <div key={l._id} className="border p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src={l.images[0]} alt={l.title} className="w-24 h-24 object-cover rounded"/>
                <div>
                  <h2 className="font-semibold">{l.title}</h2>
                  <p>${l.price}/night</p>
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