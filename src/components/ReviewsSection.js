import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle, Calendar } from 'lucide-react';
import { Button } from './ui/Button';
import apiRequest from '../services/api';

const ReviewsSection = ({ propertyId, onReviewCountChange }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    if (propertyId) {
      fetchReviews();
      fetchStats();
    }
  }, [propertyId, page, sortBy]);

  const fetchReviews = async () => {
    try {
      const data = await apiRequest(`/api/reviews/property/${propertyId}?page=${page}&limit=5&sort=${sortBy}`);
      if (page === 1) {
        setReviews(data.reviews);
      } else {
        setReviews(prev => [...prev, ...data.reviews]);
      }
      setHasMore(data.pagination.hasNext);
      if (onReviewCountChange) {
        onReviewCountChange(data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await apiRequest(`/api/reviews/property/${propertyId}/stats`);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch review stats:', error);
    }
  };

  const handleMarkHelpful = async (reviewId, helpful) => {
    try {
      await apiRequest(`/api/reviews/${reviewId}/helpful`, 'POST', { helpful });
      // Update the review's helpful count locally
      setReviews(prev => prev.map(review => {
        if (review._id === reviewId) {
          const existingMark = review.helpful.find(mark => mark.user === 'current-user');
          if (existingMark) {
            existingMark.helpful = helpful;
          } else {
            review.helpful.push({ user: 'current-user', helpful });
          }
        }
        return review;
      }));
    } catch (error) {
      console.error('Failed to mark review:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderRatingBreakdown = () => {
    if (!stats) return null;

    const categories = [
      { key: 'cleanliness', label: 'Cleanliness' },
      { key: 'communication', label: 'Communication' },
      { key: 'checkIn', label: 'Check-in' },
      { key: 'accuracy', label: 'Accuracy' },
      { key: 'location', label: 'Location' },
      { key: 'value', label: 'Value' }
    ];

    return (
      <div className="grid grid-cols-2 gap-4 mb-6">
        {categories.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{label}</span>
            <div className="flex items-center space-x-2">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${(stats[key] / 5) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{stats[key].toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-400 fill-current" size={20} />
            <span className="text-xl font-semibold">
              {stats?.averageRating?.toFixed(1) || '0.0'}
            </span>
          </div>
          <span className="text-gray-600">
            • {stats?.totalReviews || 0} reviews
          </span>
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest rated</option>
          <option value="lowest">Lowest rated</option>
        </select>
      </div>

      {/* Rating Breakdown */}
      {stats && stats.totalReviews > 0 && renderRatingBreakdown()}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={review.guest.avatar || 'https://via.placeholder.com/40'}
                  alt={review.guest.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h4 className="font-medium">{review.guest.name}</h4>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar size={14} />
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating.overall)}
              </div>
            </div>

            <p className="text-gray-700 mb-3">{review.comment}</p>

            {/* Host Response */}
            {review.response && (
              <div className="bg-gray-50 p-4 rounded-lg ml-4 border-l-4 border-green-500">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageCircle size={16} className="text-green-600" />
                  <span className="font-medium text-green-600">Host response</span>
                </div>
                <p className="text-gray-700">{review.response.comment}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.response.date).toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Helpful Buttons */}
            <div className="flex items-center space-x-4 mt-4">
              <button
                onClick={() => handleMarkHelpful(review._id, true)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-green-600"
              >
                <ThumbsUp size={16} />
                <span>Helpful</span>
              </button>
              <button
                onClick={() => handleMarkHelpful(review._id, false)}
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600"
              >
                <ThumbsDown size={16} />
                <span>Not helpful</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <Button
            onClick={() => setPage(prev => prev + 1)}
            variant="outline"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load more reviews'}
          </Button>
        </div>
      )}

      {/* No Reviews */}
      {reviews.length === 0 && !loading && (
        <div className="text-center py-8">
          <Star className="text-gray-300 mx-auto mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600">Be the first to review this property!</p>
        </div>
      )}
    </div>
  );
};

export default ReviewsSection; 