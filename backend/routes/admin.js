const express = require('express');
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalProperties,
      totalBookings,
      confirmedBookings,
      pendingUsers,
      pendingProperties,
      totalReviews
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Booking.countDocuments(),
      Booking.find({ status: { $in: ['confirmed', 'completed'] } }),
      User.countDocuments({ isVerified: false }),
      Property.countDocuments({ isVerified: false }),
      Review.countDocuments()
    ]);

    const totalRevenue = confirmedBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dayOfMonth: '$createdAt' },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      totalUsers,
      totalProperties,
      totalBookings,
      totalRevenue: totalRevenue.toFixed(2),
      pendingUsers,
      pendingProperties,
      totalReviews,
      monthlyStats
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch admin stats' });
  }
});

// Get all users with pagination and advanced filtering
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, role, status, verified, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (role) {
      query.role = role;
    }
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'suspended') {
      query.isActive = false;
    }
    if (verified === 'true') {
      query.isVerified = true;
    } else if (verified === 'false') {
      query.isVerified = false;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Bulk user operations
router.post('/users/bulk', async (req, res) => {
  try {
    const { action, userIds, data } = req.body;
    
    if (!action || !userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'verify':
        updateData = { isVerified: true };
        message = 'Users verified successfully';
        break;
      case 'suspend':
        updateData = { isActive: false };
        message = 'Users suspended successfully';
        break;
      case 'activate':
        updateData = { isActive: true };
        message = 'Users activated successfully';
        break;
      case 'changeRole':
        if (!data.role) {
          return res.status(400).json({ message: 'Role is required' });
        }
        updateData = { role: data.role };
        message = 'User roles updated successfully';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      updateData
    );

    res.json({ message, updatedCount: result.modifiedCount });
  } catch (error) {
    console.error('Bulk user operations error:', error);
    res.status(500).json({ message: 'Failed to perform bulk operations' });
  }
});

// Get all properties with pagination and advanced filtering
router.get('/properties', async (req, res) => {
  try {
    const { page = 1, limit = 50, search, status, verified, featured, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } }
      ];
    }
    if (status === 'active') {
      query.isAvailable = true;
    } else if (status === 'inactive') {
      query.isAvailable = false;
    }
    if (verified === 'true') {
      query.isVerified = true;
    } else if (verified === 'false') {
      query.isVerified = false;
    }
    if (featured === 'true') {
      query.isFeatured = true;
    } else if (featured === 'false') {
      query.isFeatured = false;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const properties = await Property.find(query)
      .populate('host', 'name email')
      .sort(sort)
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
    console.error('Admin properties error:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
});

// Bulk property operations
router.post('/properties/bulk', async (req, res) => {
  try {
    const { action, propertyIds, data } = req.body;
    
    if (!action || !propertyIds || !Array.isArray(propertyIds)) {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    let updateData = {};
    let message = '';

    switch (action) {
      case 'verify':
        updateData = { isVerified: true };
        message = 'Properties verified successfully';
        break;
      case 'feature':
        updateData = { isFeatured: true };
        message = 'Properties featured successfully';
        break;
      case 'unfeature':
        updateData = { isFeatured: false };
        message = 'Properties unfeatured successfully';
        break;
      case 'activate':
        updateData = { isAvailable: true };
        message = 'Properties activated successfully';
        break;
      case 'deactivate':
        updateData = { isAvailable: false };
        message = 'Properties deactivated successfully';
        break;
      default:
        return res.status(400).json({ message: 'Invalid action' });
    }

    const result = await Property.updateMany(
      { _id: { $in: propertyIds } },
      updateData
    );

    res.json({ message, updatedCount: result.modifiedCount });
  } catch (error) {
    console.error('Bulk property operations error:', error);
    res.status(500).json({ message: 'Failed to perform bulk operations' });
  }
});

// Get all bookings with pagination and advanced filtering
router.get('/bookings', async (req, res) => {
  try {
    const { page = 1, limit = 50, status, dateRange, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    if (dateRange) {
      const [start, end] = dateRange.split(',');
      if (start && end) {
        query.createdAt = {
          $gte: new Date(start),
          $lte: new Date(end)
        };
      }
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const bookings = await Booking.find(query)
      .populate('guest', 'name email')
      .populate('property', 'title location.city')
      .populate('host', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin bookings error:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// Get reviews with moderation features
router.get('/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 50, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
    
    const reviews = await Review.find(query)
      .populate('guest', 'name email')
      .populate('property', 'title')
      .populate('host', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments(query);

    res.json({
      reviews,
      pagination: {
        current: Number(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin reviews error:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Moderate review
router.put('/reviews/:id/moderate', async (req, res) => {
  try {
    const { action, reason } = req.body;
    
    if (!['approve', 'reject', 'flag'].includes(action)) {
      return res.status(400).json({ message: 'Invalid moderation action' });
    }

    let updateData = {};
    switch (action) {
      case 'approve':
        updateData = { status: 'approved', moderatedBy: req.user.id, moderatedAt: new Date() };
        break;
      case 'reject':
        updateData = { status: 'rejected', moderatedBy: req.user.id, moderatedAt: new Date(), moderationReason: reason };
        break;
      case 'flag':
        updateData = { status: 'flagged', moderatedBy: req.user.id, moderatedAt: new Date(), moderationReason: reason };
        break;
    }

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    )
    .populate('guest', 'name email')
    .populate('property', 'title')
    .populate('host', 'name email');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review moderated successfully',
      review
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    res.status(500).json({ message: 'Failed to moderate review' });
  }
});

// Update property status
router.put('/properties/:id/status', async (req, res) => {
  try {
    const { isAvailable } = req.body;
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { isAvailable },
      { new: true }
    ).populate('host', 'name email');

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({
      message: 'Property status updated',
      property
    });
  } catch (error) {
    console.error('Update property status error:', error);
    res.status(500).json({ message: 'Failed to update property status' });
  }
});

// Delete property
router.delete('/properties/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      property: req.params.id,
      status: { $in: ['confirmed', 'pending'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete property with active bookings' 
      });
    }

    await Property.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Failed to delete property' });
  }
});

// Update booking status
router.put('/bookings/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    .populate('guest', 'name email')
    .populate('property', 'title')
    .populate('host', 'name email');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
});

// Delete booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
});

// Get platform analytics
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate;
    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const [userGrowth, propertyGrowth, bookingGrowth, revenueData] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Property.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id': 1 } }
      ]),
      Booking.aggregate([
        { 
          $match: { 
            createdAt: { $gte: startDate },
            status: { $in: ['confirmed', 'completed'] }
          } 
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$totalPrice' }
          }
        },
        { $sort: { '_id': 1 } }
      ])
    ]);

    res.json({
      userGrowth,
      propertyGrowth,
      bookingGrowth,
      revenueData
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ message: 'Failed to fetch analytics' });
  }
});

// Get system settings
router.get('/settings', async (req, res) => {
  try {
    // This would typically come from a settings collection or environment
    const settings = {
      platformName: 'Nawartu',
      maintenanceMode: false,
      allowNewRegistrations: true,
      requireEmailVerification: true,
      requirePropertyVerification: true,
      maxImagesPerProperty: 10,
      maxPropertiesPerHost: 50,
      commissionRate: 0.15,
      supportEmail: 'support@nawartu.com',
      termsOfService: 'https://nawartu.com/terms',
      privacyPolicy: 'https://nawartu.com/privacy'
    };

    res.json(settings);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Failed to fetch settings' });
  }
});

// Update system settings
router.put('/settings', async (req, res) => {
  try {
    const { 
      maintenanceMode, 
      allowNewRegistrations, 
      requireEmailVerification,
      requirePropertyVerification,
      maxImagesPerProperty,
      maxPropertiesPerHost,
      commissionRate,
      supportEmail
    } = req.body;

    // Validate inputs
    if (maxImagesPerProperty < 1 || maxImagesPerProperty > 50) {
      return res.status(400).json({ message: 'Max images must be between 1 and 50' });
    }
    if (maxPropertiesPerHost < 1 || maxPropertiesPerHost > 100) {
      return res.status(400).json({ message: 'Max properties per host must be between 1 and 100' });
    }
    if (commissionRate < 0 || commissionRate > 1) {
      return res.status(400).json({ message: 'Commission rate must be between 0 and 1' });
    }

    // In a real app, you'd save these to a database
    // For now, we'll just return success
    res.json({ 
      message: 'Settings updated successfully',
      settings: {
        maintenanceMode,
        allowNewRegistrations,
        requireEmailVerification,
        requirePropertyVerification,
        maxImagesPerProperty,
        maxPropertiesPerHost,
        commissionRate,
        supportEmail
      }
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Failed to update settings' });
  }
});

// System cleanup
router.post('/system/cleanup', async (req, res) => {
  try {
    let cleanupCount = 0;
    
    // Remove unverified users older than 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const unverifiedUsers = await User.deleteMany({
      isVerified: false,
      createdAt: { $lt: thirtyDaysAgo }
    });
    cleanupCount += unverifiedUsers.deletedCount;

    // Remove cancelled bookings older than 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const cancelledBookings = await Booking.deleteMany({
      status: 'cancelled',
      createdAt: { $lt: ninetyDaysAgo }
    });
    cleanupCount += cancelledBookings.deletedCount;

    // Remove inactive properties (not available and no bookings for 6 months)
    const sixMonthsAgo = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
    const inactiveProperties = await Property.find({
      isAvailable: false,
      updatedAt: { $lt: sixMonthsAgo }
    });

    for (const property of inactiveProperties) {
      const hasRecentBookings = await Booking.countDocuments({
        property: property._id,
        createdAt: { $gte: sixMonthsAgo }
      });

      if (hasRecentBookings === 0) {
        await Property.findByIdAndDelete(property._id);
        cleanupCount++;
      }
    }

    res.json({
      message: 'System cleanup completed',
      itemsRemoved: cleanupCount
    });
  } catch (error) {
    console.error('System cleanup error:', error);
    res.status(500).json({ message: 'Failed to perform system cleanup' });
  }
});

module.exports = router;