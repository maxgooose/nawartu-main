import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiRequest from '../services/api';
import { toast } from 'react-toastify';
import { 
  Users, 
  Home, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MessageSquare,
  Settings,
  BarChart3,
  Shield,
  Star
} from 'lucide-react';
import BackButton from '../components/ui/BackButton';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [showCreateAdminModal, setShowCreateAdminModal] = useState(false);
  const [showBulkOperationsModal, setShowBulkOperationsModal] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      window.location.href = '/';
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, usersRes, propertiesRes, bookingsRes, reviewsRes, settingsRes] = await Promise.all([
        apiRequest('/api/admin/stats'),
        apiRequest('/api/admin/users'),
        apiRequest('/api/admin/properties'),
        apiRequest('/api/admin/bookings'),
        apiRequest('/api/admin/reviews'),
        apiRequest('/api/admin/settings')
      ]);
      
      setStats(statsRes);
      setUsers(usersRes.users || []);
      setProperties(propertiesRes.properties || []);
      setBookings(bookingsRes.bookings || []);
      setReviews(reviewsRes.reviews || []);
      setSettings(settingsRes);
    } catch (error) {
      console.error('Admin dashboard error:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await apiRequest(`/api/users/${userId}/role`, 'PUT', { role: newRole });
      toast.success('User role updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await apiRequest(`/api/users/${userId}`, 'DELETE');
        toast.success('User deleted');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const togglePropertyStatus = async (propertyId, isAvailable) => {
    try {
      await apiRequest(`/api/admin/properties/${propertyId}/status`, 'PUT', { isAvailable: !isAvailable });
      toast.success('Property status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update property');
    }
  };

  const moderateReview = async (reviewId, action) => {
    try {
      await apiRequest(`/api/admin/reviews/${reviewId}/moderate`, 'PUT', { action });
      toast.success(`Review ${action}ed successfully`);
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to moderate review');
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    try {
      await apiRequest('/api/admin/settings', 'PUT', settings);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const performBulkAction = async (action, itemIds, data = {}) => {
    try {
      const endpoint = activeTab === 'users' ? '/api/admin/users/bulk' : '/api/admin/properties/bulk';
      const payload = { 
        action, 
        [activeTab === 'users' ? 'userIds' : 'propertyIds']: itemIds, 
        data 
      };
      
      await apiRequest(endpoint, 'POST', payload);
      toast.success('Bulk action completed successfully');
      fetchDashboardData();
      setSelectedItems([]);
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to perform bulk action');
    }
  };

  const performSingleAction = async (action, itemId, data = {}) => {
    try {
      await performBulkAction(action, [itemId], data);
    } catch (error) {
      console.error('Single action error:', error);
    }
  };

  const handleBulkSelection = (itemId, isChecked) => {
    if (isChecked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const handleSelectAll = (isChecked, items) => {
    if (isChecked) {
      setSelectedItems(items.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  // Helper function to calculate time ago
  const getTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await apiRequest(`/api/admin/bookings/${bookingId}/status`, 'PUT', { status: newStatus });
      toast.success('Booking status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  // Delete booking
  const deleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await apiRequest(`/api/admin/bookings/${bookingId}`, 'DELETE');
        toast.success('Booking deleted');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete booking');
      }
    }
  };

  // Delete property
  const deleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await apiRequest(`/api/admin/properties/${propertyId}`, 'DELETE');
        toast.success('Property deleted successfully');
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  // System cleanup function
  const performSystemCleanup = async () => {
    if (window.confirm('This will remove inactive accounts and clean up old data. Continue?')) {
      try {
        // This would call a backend endpoint for system cleanup
        await apiRequest('/api/admin/system/cleanup', 'POST');
        toast.success('System cleanup completed');
        fetchDashboardData();
      } catch (error) {
        toast.error('System cleanup failed');
      }
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600">Admin access required</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="mb-4">
            <BackButton variant="outline" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Nawartu Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, properties, and bookings</p>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={filters.search || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {activeTab === 'users' && (
            <div className="flex gap-2">
              <select
                value={filters.role || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="host">Host</option>
                <option value="admin">Admin</option>
              </select>
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          )}
          
          {activeTab === 'properties' && (
            <div className="flex gap-2">
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={filters.verified || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Verification</option>
                <option value="true">Verified</option>
                <option value="false">Pending</option>
              </select>
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div className="flex gap-2">
              <select
                value={filters.status || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
          
          <button
            onClick={() => setFilters({})}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <nav className="px-6">
          <div className="flex space-x-6 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'properties', label: 'Properties', icon: Home },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
              { id: 'reviews', label: 'Reviews', icon: MessageSquare },
              { id: 'system', label: 'System', icon: Shield },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Users className="h-12 w-12 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || users.length}</p>
                    {stats.pendingUsers > 0 && (
                      <p className="text-xs text-orange-600">{stats.pendingUsers} pending verification</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Home className="h-12 w-12 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Properties</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalProperties || properties.length}</p>
                    {stats.pendingProperties > 0 && (
                      <p className="text-xs text-orange-600">{stats.pendingProperties} pending verification</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Calendar className="h-12 w-12 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBookings || bookings.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <DollarSign className="h-12 w-12 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue || '0'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <MessageSquare className="h-12 w-12 text-indigo-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReviews || reviews.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Shield className="h-12 w-12 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {(stats.pendingUsers || 0) + (stats.pendingProperties || 0)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <Star className="h-12 w-12 text-yellow-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Hosts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {users.filter(u => u.role === 'host' && u.isActive !== false).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Manage Users</p>
                  <p className="text-xs text-gray-500">Verify, suspend, or change roles</p>
                </button>
                
                <button
                  onClick={() => setActiveTab('properties')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <Home className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Manage Properties</p>
                  <p className="text-xs text-gray-500">Verify, feature, or moderate</p>
                </button>
                
                <button
                  onClick={() => setActiveTab('reviews')}
                  className="p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <MessageSquare className="h-8 w-8 text-indigo-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-900">Moderate Reviews</p>
                  <p className="text-xs text-gray-500">Approve, reject, or flag</p>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map(booking => (
                  <div key={booking._id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{booking.guest?.name || 'Unknown'} booked {booking.property?.title || 'Property'}</p>
                      <p className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Users Management</h3>
                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => performBulkAction('verify', selectedItems)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Verify Selected
                      </button>
                      <button
                        onClick={() => performBulkAction('suspend', selectedItems)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Suspend Selected
                      </button>
                      <button
                        onClick={() => performBulkAction('activate', selectedItems)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Activate Selected
                      </button>
                      <button
                        onClick={() => setSelectedItems([])}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === users.length && users.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked, users)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(user._id)}
                          onChange={(e) => handleBulkSelection(user._id, e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user._id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="user">User</option>
                          <option value="host">Host</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.isActive === false ? 'bg-red-100 text-red-800' :
                          user.isVerified ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {user.isActive === false ? 'Suspended' :
                           user.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => performSingleAction('verify', user._id)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Verify"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => performSingleAction('suspend', user._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Suspend"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Properties Management</h3>
                {selectedItems.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => performBulkAction('verify', selectedItems)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Verify Selected
                      </button>
                      <button
                        onClick={() => performBulkAction('feature', selectedItems)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Feature Selected
                      </button>
                      <button
                        onClick={() => performBulkAction('activate', selectedItems)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Activate Selected
                      </button>
                      <button
                        onClick={() => setSelectedItems([])}
                        className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 transition-colors"
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === properties.length && properties.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked, properties)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {properties.map(property => (
                    <tr key={property._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(property._id)}
                          onChange={(e) => handleBulkSelection(property._id, e.target.checked)}
                          className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={property.images[0]} 
                            alt={property.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{property.title}</div>
                            <div className="text-sm text-gray-500">{property.location.city}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {property.host?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${property.price}/night
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <button
                            onClick={() => togglePropertyStatus(property._id, property.isAvailable)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                              property.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {property.isAvailable ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            <span>{property.isAvailable ? 'Active' : 'Inactive'}</span>
                          </button>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            property.isVerified ? 'bg-green-100 text-green-800' :
                            property.isFeatured ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {property.isVerified ? 'Verified' :
                             property.isFeatured ? 'Featured' : 'Standard'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => performSingleAction('verify', property._id)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Verify"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => performSingleAction('feature', property._id)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Feature"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 mr-2 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => deleteProperty(property._id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete Property"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Bookings Management</h3>
                <button
                  onClick={() => fetchDashboardData()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Refresh Data
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest Info</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Host Info</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount & Payment</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bookings.map(booking => {
                    const bookingTime = new Date(booking.createdAt);
                    const timeAgo = getTimeAgo(bookingTime);
                    
                    return (
                      <tr key={booking._id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.guest?.name || 'Unknown Guest'}
                            </div>
                            <div className="text-sm text-blue-600">
                              {booking.guest?.email || 'No email'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {booking.host?.name || 'Unknown Host'}
                            </div>
                            <div className="text-sm text-blue-600">
                              {booking.host?.email || 'No email'}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {booking.property?.title || 'Unknown Property'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.property?.location?.city || 'Unknown location'}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            <div className="font-medium">Check-in:</div>
                            <div>{new Date(booking.checkIn).toLocaleDateString()}</div>
                            <div className="font-medium mt-1">Check-out:</div>
                            <div>{new Date(booking.checkOut).toLocaleDateString()}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-bold text-gray-900">
                              ${booking.totalPrice}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                              booking.paymentMethod === 'card' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {booking.paymentMethod === 'card' ? 'Card' : 'Cash'}
                              {booking.paymentMethod === 'card' && booking.paymentDetails?.last4 && 
                                ` ****${booking.paymentDetails.last4}`}
                            </div>
                            <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ml-1 ${
                              booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
                              booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {booking.paymentStatus}
                            </div>
                            {booking.confirmationCode && (
                              <div className="text-xs text-gray-600 mt-1">
                                Code: <span className="font-mono font-bold">{booking.confirmationCode}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bookingTime.toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-900">
                            {bookingTime.toLocaleTimeString()}
                          </div>
                          <div className="text-xs text-blue-600 font-medium">
                            {timeAgo}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <div className="flex space-x-2">
                            <select
                              value={booking.status}
                              onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                              <option value="completed">Completed</option>
                            </select>
                            <button
                              onClick={() => deleteBooking(booking._id)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete Booking"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Reviews Moderation</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reviews.map(review => (
                    <tr key={review._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {review.guest?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {review.property?.title || 'Unknown Property'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{review.rating}</span>
                          <Star className="h-4 w-4 text-yellow-400 ml-1" />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {review.comment}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          review.status === 'approved' ? 'bg-green-100 text-green-800' :
                          review.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          review.status === 'flagged' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => moderateReview(review._id, 'approve')}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => moderateReview(review._id, 'reject')}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => moderateReview(review._id, 'flag')}
                            className="text-orange-600 hover:text-orange-900"
                            title="Flag"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* Account Management */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Account Management</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-blue-900">Create New Admin</h4>
                        <p className="text-xs text-blue-700 mt-1">Add a new administrator</p>
                      </div>
                      <button
                        onClick={() => setShowCreateAdminModal(true)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-green-900">Bulk User Operations</h4>
                        <p className="text-xs text-green-700 mt-1">Mass verify or suspend users</p>
                      </div>
                      <button
                        onClick={() => setShowBulkOperationsModal(true)}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-red-900">System Cleanup</h4>
                        <p className="text-xs text-red-700 mt-1">Remove inactive accounts</p>
                      </div>
                      <button
                        onClick={() => performSystemCleanup()}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Cleanup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Statistics */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Platform Statistics</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="text-sm text-gray-600">Admins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'host').length}</div>
                    <div className="text-sm text-gray-600">Hosts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'user').length}</div>
                    <div className="text-sm text-gray-600">Regular Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{users.filter(u => u.isActive === false).length}</div>
                    <div className="text-sm text-gray-600">Suspended</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Admin Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Recent Admin Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium">User role updated</p>
                      <p className="text-xs text-gray-500">2 minutes ago</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">User Management</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium">Property deleted</p>
                      <p className="text-xs text-gray-500">15 minutes ago</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Property Management</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <p className="text-sm font-medium">Booking status changed</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Booking Management</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">System Health</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Database</p>
                      <p className="text-sm text-green-600">Connected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">API Server</p>
                      <p className="text-sm text-green-600">Running</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Storage</p>
                      <p className="text-sm text-yellow-600">85% Full</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">User Growth (Last 30 Days)</h4>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Chart placeholder</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Revenue Trend (Last 30 Days)</h4>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Chart placeholder</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Platform Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.maintenanceMode || false}
                      onChange={(e) => updateSetting('maintenanceMode', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Maintenance Mode</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Temporarily disable the platform</p>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={settings.allowNewRegistrations || false}
                      onChange={(e) => updateSetting('allowNewRegistrations', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Allow New Registrations</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1">Enable/disable new user signups</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Images Per Property
                  </label>
                  <input
                    type="number"
                    value={settings.maxImagesPerProperty || 10}
                    onChange={(e) => updateSetting('maxImagesPerProperty', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="1"
                    max="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    value={((settings.commissionRate || 0.15) * 100).toFixed(1)}
                    onChange={(e) => updateSetting('commissionRate', parseFloat(e.target.value) / 100)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Support Email
                </label>
                                  <input
                    type="email"
                    value={settings.supportEmail || ''}
                    onChange={(e) => updateSetting('supportEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={saveSettings}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;