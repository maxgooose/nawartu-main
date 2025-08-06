import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RevenueChart = ({ chartData }) => {
  if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Over Time</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No revenue data available yet.</p>
          <p className="text-sm mt-2">Start hosting to see your earnings!</p>
        </div>
      </div>
    );
  }

  // Transform the monthlyData format to chart format
  const labels = chartData.map(item => item.month);
  const revenueData = chartData.map(item => item.revenue || 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Monthly Revenue',
        data: revenueData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Revenue Over Last 6 Months',
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                    return '$' + value;
                }
            }
        }
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <Bar data={data} options={options} />
    </div>
  );
};

export default RevenueChart;
