import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import apiRequest from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import AnalyticsSummary from '../components/host/AnalyticsSummary';
import RecentBookings from '../components/host/RecentBookings';
import HostPropertyList from '../components/host/HostPropertyList';
import RevenueChart from '../components/host/RevenueChart';
import { DollarSign, Bed, BarChart, Calendar } from 'lucide-react';

const HostDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      const fetchDashboardData = async () => {
        try {
          const data = await apiRequest(`/api/host/analytics/summary`);
          setDashboardData(data);
        } catch (err) {
          toast.error('Failed to load host dashboard data');
        } finally {
          setLoading(false);
        }
      };
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl">Loading Host Dashboard...</p>
      </div>
    );
  }

  if (!dashboardData) {
    return <div className="p-8 text-center">No data available for the host dashboard.</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Host Dashboard
              </h1>
              {user && (
                <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
              )}
            </div>
            <div className="flex gap-3">
              <Link to="/my-listings" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Manage Listings
              </Link>
              <Link to="/" className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnalyticsSummary summary={dashboardData.summary || {}} />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RevenueChart chartData={dashboardData.monthlyData || []} />
            </div>
            <div className="lg:col-span-1">
              <RecentBookings bookings={dashboardData.recentBookings || []} />
            </div>
          </div>
          
          <div className="mt-8">
            <HostPropertyList properties={dashboardData.properties || []} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default HostDashboardPage;
