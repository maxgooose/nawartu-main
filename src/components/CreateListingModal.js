import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { Input } from './ui/input';
import { Button } from './ui/Button';
import { AuthContext } from '../context/AuthContext';
import apiRequest from '../services/api';

const amenityOptions = [
  'Wi-Fi', 'Kitchen', 'Air Conditioning', 'Heating', 'TV', 
  'Washing Machine', 'Free Parking', 'Balcony', 'Garden',
  'Pool', 'Gym', 'Security', 'Elevator', 'Pet Friendly'
];

const propertyTypeOptions = ['Apartment', 'House', 'Villa', 'Studio', 'Loft', 'Traditional'];

const CreateListingModal = ({ isOpen, onClose, onListingCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState(null);
  const [guests, setGuests] = useState(2);
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [propertyType, setPropertyType] = useState('Apartment');
  const [amenities, setAmenities] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const handleAmenityChange = (amenity) => {
    setAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (user.role !== 'host') {
      try {
        await apiRequest('/api/auth/become-host', 'POST');
      } catch(err) {
        setError('Could not upgrade to host role.');
        return;
      }
    }

    let imageUrl = "https://picsum.photos/seed/picsum/800/600";
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      try {
        const uploadData = await apiRequest('/api/upload', 'POST', formData);
        imageUrl = uploadData.imageUrl;
      } catch (err) {
        setError('Image upload failed. Please try again.');
        return;
      }
    }

    try {
      const propertyData = {
        title,
        description,
        price: Number(price),
        location: {
          address: `${location}, Damascus`,
          neighborhood: location
        },
        images: [imageUrl],
        capacity: { 
          guests: Number(guests), 
          bedrooms: Number(bedrooms), 
          bathrooms: Number(bathrooms) 
        },
        propertyType,
        amenities,
      };
      const data = await apiRequest('/api/properties', 'POST', propertyData);
      
      if (onListingCreated) onListingCreated(data.property);
      onClose();
      
      window.location.reload();

    } catch (err) {
      setError(err.message || 'Failed to create listing.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Listing">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        
        <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        
        <Input 
          type="file" 
          accept="image/*" 
          onChange={(e) => setImage(e.target.files[0])} 
          className="w-full"
        />
        
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        ></textarea>
        
        <div className="grid grid-cols-2 gap-4">
            <Input type="number" placeholder="Price per night" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Input type="text" placeholder="Neighborhood (e.g., Old City)" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input type="number" label="Guests" value={guests} onChange={(e) => setGuests(e.target.value)} min="1" required />
          <Input type="number" label="Bedrooms" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} min="1" required />
          <Input type="number" label="Bathrooms" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} min="1" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Property Type</label>
          <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="w-full p-2 border rounded mt-1">
            {propertyTypeOptions.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {amenityOptions.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2">
                <input 
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => handleAmenityChange(amenity)}
                  className="rounded"
                />
                <span>{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">Create Listing</Button>
      </form>
    </Modal>
  );
};

export default CreateListingModal; 