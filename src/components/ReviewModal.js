import React, { useState } from 'react';
import Modal from './Modal';
import { Button } from './ui/Button';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'react-toastify';
import apiRequest from '../services/api';

const ReviewModal = ({ isOpen, onClose, booking, onReviewSubmitted }) => {
  const [rating, setRating] = useState({
    overall: 5,
    cleanliness: 5,
    communication: 5,
    checkIn: 5,
    accuracy: 5,
    location: 5,
    value: 5
  });
  const [comment, setComment] = useState('');
  const [privateComment, setPrivateComment] = useState('');
  const [loading, setLoading] = useState(false);

  const ratingCategories = [
    { key: 'overall', label: 'Overall', required: true },
    { key: 'cleanliness', label: 'Cleanliness' },
    { key: 'communication', label: 'Communication' },
    { key: 'checkIn', label: 'Check-in' },
    { key: 'accuracy', label: 'Accuracy' },
    { key: 'location', label: 'Location' },
    { key: 'value', label: 'Value' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest('/api/reviews', 'POST', {
        bookingId: booking._id,
        rating,
        comment: comment.trim(),
        privateComment: privateComment.trim()
      });

      toast.success('Review submitted successfully!');
      onReviewSubmitted(data.review);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (category, value, onChange) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(category, star)}
            className="focus:outline-none"
          >
            <Star
              size={20}
              className={`${
                star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Write a Review">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold">{booking.property?.title}</h3>
          <p className="text-sm text-gray-600">
            {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
          </p>
        </div>

        {/* Rating Categories */}
        <div className="space-y-4">
          {ratingCategories.map(({ key, label, required }) => (
            <div key={key} className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              {renderStars(key, rating[key], (category, value) => 
                setRating(prev => ({ ...prev, [category]: value }))
              )}
            </div>
          ))}
        </div>

        {/* Public Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Public Review <span className="text-red-500">*</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with other travelers..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={4}
            maxLength={1000}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Private Comment */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Private Feedback (Optional)
          </label>
          <textarea
            value={privateComment}
            onChange={(e) => setPrivateComment(e.target.value)}
            placeholder="This will only be shared with the host..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows={3}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">
            {privateComment.length}/500 characters
          </p>
        </div>

        {/* Review Guidelines */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Review Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be honest and specific about your experience</li>
            <li>• Focus on the property, location, and host communication</li>
            <li>• Avoid personal attacks or inappropriate content</li>
            <li>• Reviews help other travelers make informed decisions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ReviewModal; 