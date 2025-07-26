import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MapPin, Users, Bed, DollarSign, Calendar } from 'lucide-react';
import { Button } from './Button';

const AdvancedSearch = ({ onSearch, onFiltersChange, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    guests: '',
    bedrooms: '',
    priceMin: '',
    priceMax: '',
    checkIn: '',
    checkOut: '',
    amenities: []
  });

  const amenities = [
    'WiFi', 'Kitchen', 'Air Conditioning', 'Free Parking', 
    'Pool', 'Garden', 'Balcony', 'Pet Friendly'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange?.(newFilters);
  };

  const handleAmenityToggle = (amenity) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    
    handleFilterChange('amenities', newAmenities);
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      guests: '',
      bedrooms: '',
      priceMin: '',
      priceMax: '',
      checkIn: '',
      checkOut: '',
      amenities: []
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Where do you want to go?"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Filter size={18} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          )}
        </Button>
        
        <Button
          onClick={() => onSearch?.(filters)}
          className="px-6"
        >
          Search
        </Button>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 pt-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users size={16} className="inline mr-1" />
                  Guests
                </label>
                <select
                  value={filters.guests}
                  onChange={(e) => handleFilterChange('guests', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num}+ guests</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Bed size={16} className="inline mr-1" />
                  Bedrooms
                </label>
                <select
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Any</option>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}+ bedrooms</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign size={16} className="inline mr-1" />
                  Price Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceMin}
                    onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceMax}
                    onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Dates */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar size={16} className="inline mr-1" />
                  Check-in
                </label>
                <input
                  type="date"
                  value={filters.checkIn}
                  onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button
                onClick={clearFilters}
                variant="outline"
                size="sm"
              >
                Clear all filters
              </Button>
              
              <div className="text-sm text-gray-500">
                {hasActiveFilters && (
                  <span>
                    {Object.values(filters).filter(v => Array.isArray(v) ? v.length > 0 : v !== '').length} filters active
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch; 