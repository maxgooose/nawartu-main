const express = require('express');
const Property = require('../models/Property');
const User = require('../models/User');
const { authenticateToken, requireHost, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all properties with search and filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      search,
      neighborhood,
      minPrice,
      maxPrice,
      guests,
      propertyType,
      amenities,
      page = 1,
      limit = 12
    } = req.query;

    const query = { isAvailable: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by neighborhood
    if (neighborhood) {
      query['location.neighborhood'] = neighborhood;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Guest capacity
    if (guests) {
      query['capacity.guests'] = { $gte: Number(guests) };
    }

    // Property type
    if (propertyType) {
      query.propertyType = propertyType;
    }

    // Amenities
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      query.amenities = { $all: amenitiesArray };
    }

    const skip = (page - 1) * limit;

    const properties = await Property.find(query)
      .populate('host', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Property.countDocuments(query);

    res.json({
      properties,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

// Get single property
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('host', 'name avatar phone')
      .populate('reviews.user', 'name avatar');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Failed to fetch property' });
  }
});

// Create new property (host only)
router.post('/', authenticateToken, requireHost, async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      host: req.user._id
    };

    const property = new Property(propertyData);
    await property.save();

    const populatedProperty = await Property.findById(property._id)
      .populate('host', 'name avatar');

    res.status(201).json({
      message: 'Property created successfully',
      property: populatedProperty
    });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Failed to create property' });
  }
});

// Update property (host only)
router.put('/:id', authenticateToken, requireHost, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('host', 'name avatar');

    res.json({
      message: 'Property updated successfully',
      property: updatedProperty
    });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Failed to update property' });
  }
});

// Delete property (host only)
router.delete('/:id', authenticateToken, requireHost, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user owns the property
    if (property.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Failed to delete property' });
  }
});

// Add review to property
router.post('/:id/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user already reviewed this property
    const existingReview = property.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this property' });
    }

    property.reviews.push({
      user: req.user._id,
      rating,
      comment
    });

    // Update average rating
    const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
    property.rating.average = totalRating / property.reviews.length;
    property.rating.count = property.reviews.length;

    await property.save();

    const populatedProperty = await Property.findById(req.params.id)
      .populate('reviews.user', 'name avatar');

    res.json({
      message: 'Review added successfully',
      property: populatedProperty
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Failed to add review' });
  }
});

// Get neighborhoods for filtering
router.get('/neighborhoods/list', async (req, res) => {
  try {
    const neighborhoods = await Property.distinct('location.neighborhood');
    res.json(neighborhoods);
  } catch (error) {
    console.error('Get neighborhoods error:', error);
    res.status(500).json({ message: 'Failed to fetch neighborhoods' });
  }
});

// Toggle favorite property
router.post('/:id/favorite', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const propertyId = req.params.id;

    const isFavorite = user.favorites.includes(propertyId);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== propertyId);
    } else {
      // Add to favorites
      user.favorites.push(propertyId);
    }

    await user.save();

    res.json({
      message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
      isFavorite: !isFavorite
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Failed to update favorites' });
  }
});

module.exports = router; 