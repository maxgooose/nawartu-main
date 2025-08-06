import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

const HostPropertyList = ({ properties }) => {
  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Your Properties</h3>
        <p className="mt-4 text-gray-500">You have no properties listed.</p>
        <Link to="/my-listings" className="text-blue-500 hover:underline mt-2 inline-block">Manage your listings</Link>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900">Your Properties</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
                <Link to={`/property/${property._id}`} key={property._id} className="group">
                    <div className="rounded-lg overflow-hidden border">
                        <img 
                            src={property.images && property.images[0] ? property.images[0] : '/placeholder-image.svg'} 
                            alt={property.title}
                            className="h-48 w-full object-cover group-hover:opacity-90"
                            onError={(e) => {
                                e.target.src = '/placeholder-image.svg';
                            }}
                        />
                        <div className="p-4 bg-white">
                            <p className="text-sm text-gray-500">{property.location?.city || 'Location'}</p>
                            <h4 className="font-semibold text-gray-800 truncate">{property.title}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-md font-bold">${property.price} <span className="font-normal text-sm text-gray-500">/ night</span></p>
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="ml-1 text-sm text-gray-600">{property.rating?.average?.toFixed(1) || '0.0'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
            </div>
      </div>
    </div>
  );
};

export default HostPropertyList;
