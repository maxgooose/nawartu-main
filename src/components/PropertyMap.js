import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Navigation } from 'lucide-react';
import apiRequest from '../services/api';

const PropertyMap = ({ property, height = '400px', showNearby = false }) => {
  const [center, setCenter] = useState({ lat: 33.5138, lng: 36.2765 }); // Default to Damascus
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (property?.location?.coordinates) {
      setCenter({
        lat: property.location.coordinates.lat,
        lng: property.location.coordinates.lng
      });
      setLoading(false);
    }
  }, [property]);

  useEffect(() => {
    if (showNearby && property?.location?.coordinates) {
      fetchNearbyPlaces();
    }
  }, [showNearby, property]);

  const fetchNearbyPlaces = async () => {
    try {
      const { lat, lng } = property.location.coordinates;
      const data = await apiRequest(`/api/maps/attractions/${property._id}?radius=3000`);
      setNearbyPlaces([
        ...data.attractions.slice(0, 5),
        ...data.restaurants.slice(0, 3),
        ...data.transportation.slice(0, 2)
      ]);
    } catch (error) {
      console.error('Failed to fetch nearby places:', error);
    }
  };

  const mapContainerStyle = {
    width: '100%',
    height: height
  };

  const getMarkerIcon = (type) => {
    if (type === 'tourist_attraction') return '🏛️';
    if (type === 'restaurant') return '🍽️';
    if (type === 'transit_station') return '🚇';
    return '📍';
  };

  const getDirections = () => {
    if (property?.location?.coordinates) {
      const { lat, lng } = property.location.coordinates;
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative">
      <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: false,
          }}
        >
          {/* Property Marker */}
          {property && (
            <Marker
              position={center}
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="#012F01"/>
                    <circle cx="20" cy="20" r="12" fill="white"/>
                    <circle cx="20" cy="20" r="8" fill="#012F01"/>
                  </svg>
                `),
                scaledSize: { width: 40, height: 40 }
              }}
              onClick={() => setSelectedPlace({
                name: property.title,
                address: property.location.address,
                type: 'property'
              })}
            />
          )}

          {/* Nearby Places Markers */}
          {showNearby && nearbyPlaces.map((place, index) => (
            <Marker
              key={place.placeId || index}
              position={{ lat: place.location.lat, lng: place.location.lng }}
              label={{
                text: getMarkerIcon(place.types?.[0]),
                fontSize: '16px'
              }}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {/* Info Window */}
          {selectedPlace && (
            <InfoWindow
              position={
                selectedPlace.type === 'property' 
                  ? center 
                  : { lat: selectedPlace.location.lat, lng: selectedPlace.location.lng }
              }
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold text-sm">{selectedPlace.name}</h3>
                {selectedPlace.address && (
                  <p className="text-xs text-gray-600">{selectedPlace.address}</p>
                )}
                {selectedPlace.vicinity && (
                  <p className="text-xs text-gray-600">{selectedPlace.vicinity}</p>
                )}
                {selectedPlace.rating && (
                  <p className="text-xs text-yellow-600">⭐ {selectedPlace.rating}</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Directions Button */}
      {property && (
        <button
          onClick={getDirections}
          className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title="Get directions"
        >
          <Navigation size={20} className="text-gray-700" />
        </button>
      )}
    </div>
  );
};

export default PropertyMap; 