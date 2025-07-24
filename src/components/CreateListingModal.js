import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { Input } from './ui/input';
import { Button } from './ui/Button';
import { AuthContext } from '../context/AuthContext';
import apiRequest from '../services/api';

const CreateListingModal = ({ isOpen, onClose, onListingCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const { user } = useContext(AuthContext);

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

    let imageUrl = "https://picsum.photos/seed/picsum/800/600"; // default
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
        capacity: { guests: 2, bedrooms: 1, bathrooms: 1},
        propertyType: 'Apartment'
      };
      const data = await apiRequest('/api/properties', 'POST', propertyData);
      onListingCreated(data.property);
      onClose();
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
          required 
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          required
        ></textarea>
        <Input type="number" placeholder="Price per night" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <Input type="text" placeholder="Neighborhood (e.g., Old City)" value={location} onChange={(e) => setLocation(e.target.value)} required />
        <Button type="submit" className="w-full">Create Listing</Button>
      </form>
    </Modal>
  );
};

export default CreateListingModal; 