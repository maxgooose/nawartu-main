import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from '../services/api';
import { MapPin, Calendar, BedDouble, Users, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
import BookingModal from '../components/BookingModal';
import { AuthContext } from '../context/AuthContext';

const PRIMARY_GREEN = '#012F01';
const ACCENT_GREEN = '#007BFF'; // Added for the new button

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setBookingOpen] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const data = await apiRequest(`/api/properties/${id}`);
        setProperty(data);
      } catch (err) {
        console.error('Failed to fetch property', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <div className="p-8">Loading property...</div>;
  if (!property) return <div className="p-8">Property not found.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <p>Loading...</p>
        ) : !property ? (
          <p>Property not found.</p>
        ) : (
          <>
            <header className="mb-4">
              <h1 className="text-4xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-md text-gray-600 flex items-center gap-2 mt-2">
                <Star size={16} className="text-yellow-500" /> 4.8 · 
                <MapPin size={16} /> {property.location.address}
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <img
                src={property.images?.[0] || 'https://picsum.photos/1200/800'}
                alt={property.title}
                className="col-span-2 row-span-2 w-full h-full object-cover rounded-lg shadow-md"
              />
              {/* Add more images here if available */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-semibold mb-2">Hosted by {property.host.name}</h2>
                <div className="flex items-center space-x-4 text-gray-600 mb-6">
                  <span className="flex items-center gap-2"><Users size={18} /> {property.capacity.guests} guests</span>
                  <span className="flex items-center gap-2"><BedDouble size={18} /> {property.capacity.bedrooms} bedrooms</span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
              </div>

              <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                  <p className="text-2xl font-bold mb-4">
                    ${property.price} <span className="text-gray-500 text-base font-normal">/ night</span>
                  </p>
                  <Button onClick={() => setBookingOpen(true)} className="w-full text-white font-bold py-3" style={{ backgroundColor: ACCENT_GREEN }}>
                    Book Your Stay
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {user && (
        <BookingModal isOpen={isBookingOpen} onClose={() => setBookingOpen(false)} propertyId={id} onBooked={() => {}} />
      )}
    </div>
  );
};

export default PropertyPage; 