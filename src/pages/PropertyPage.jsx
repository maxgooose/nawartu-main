import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import apiRequest from '../services/api';
import { MapPin, Calendar, BedDouble, Users, Star, Map } from 'lucide-react';
import { Button } from '../components/ui/Button';
import BookingModal from '../components/BookingModal';
import PropertyMap from '../components/PropertyMap';
import ReviewsSection from '../components/ReviewsSection';
import { AuthContext } from '../context/AuthContext';

const PRIMARY_GREEN = '#012F01';
const ACCENT_GREEN = '#007BFF'; // Added for the new button

const PropertyPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setBookingOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
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
                
                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('description')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'description'
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab('reviews')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'reviews'
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() => setActiveTab('location')}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === 'location'
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Location
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                  {activeTab === 'description' && (
                    <div>
                      <p className="text-gray-700 whitespace-pre-wrap mb-6">{property.description}</p>
                      
                      {/* Amenities */}
                      {property.amenities && property.amenities.length > 0 && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">What this place offers</h3>
                          <div className="grid grid-cols-2 gap-3">
                            {property.amenities.map((amenity, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-gray-700">{amenity}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <ReviewsSection propertyId={property._id} />
                  )}

                  {activeTab === 'location' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Location</h3>
                      <p className="text-gray-700 mb-4">{property.location.address}</p>
                      <PropertyMap property={property} height="400px" showNearby={true} />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 sticky top-4">
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