import React from 'react';
import { BarChart, DollarSign, Bed, Calendar } from 'lucide-react';

const AnalyticsSummary = ({ summary }) => {
  if (!summary) return null;

  const summaryItems = [
    {
      icon: <DollarSign className="h-8 w-8 text-green-500" />,
      label: 'Total Revenue',
      value: `$${(summary.totalRevenue || 0).toFixed(2)}`,
    },
    {
      icon: <Calendar className="h-8 w-8 text-blue-500" />,
      label: 'Total Bookings',
      value: summary.totalBookings || 0,
    },
    {
      icon: <Bed className="h-8 w-8 text-purple-500" />,
      label: 'Total Properties',
      value: summary.totalProperties || 0,
    },
    {
      icon: <BarChart className="h-8 w-8 text-yellow-500" />,
      label: 'Avg. Daily Rate',
      value: `$${(summary.averageDailyRate || 0).toFixed(0)}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {summaryItems.map((item, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5 flex items-center">
            <div className="flex-shrink-0">
              {item.icon}
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{item.label}</dt>
                <dd className="text-2xl font-semibold text-gray-900">{item.value}</dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsSummary;
