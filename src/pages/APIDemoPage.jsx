import React, { useState } from 'react';
import { MapPin, Mail, Navigation, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { googleMapsService, emailJSService } from '../services/apiIntegrations';

const APIDemoPage = () => {
  const [activeTab, setActiveTab] = useState('google-maps');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({});
  const [formData, setFormData] = useState({
    address: 'New York, NY',
    latitude: 40.7128,
    longitude: -74.0060,
    email: 'test@example.com',
    name: 'Test User',
    message: 'This is a test message',
    phoneNumber: '+1234567890'
  });

  // Google Maps Demo Functions
  const testGeocode = async () => {
    setLoading(true);
    try {
      const result = await googleMapsService.geocodeAddress(formData.address);
      setResults(prev => ({ ...prev, geocode: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, geocode: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const testReverseGeocode = async () => {
    setLoading(true);
    try {
      const result = await googleMapsService.reverseGeocode(
        parseFloat(formData.latitude),
        parseFloat(formData.longitude)
      );
      setResults(prev => ({ ...prev, reverseGeocode: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, reverseGeocode: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const testNearbyPlaces = async () => {
    setLoading(true);
    try {
      const result = await googleMapsService.getNearbyPlaces(
        parseFloat(formData.latitude),
        parseFloat(formData.longitude),
        1000,
        'lodging'
      );
      setResults(prev => ({ ...prev, nearbyPlaces: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, nearbyPlaces: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  // EmailJS Demo Functions
  const sendTestEmail = async () => {
    setLoading(true);
    try {
      const result = await emailJSService.sendEmail({
        to_email: formData.email,
        user_name: formData.name,
        message: formData.message,
        from_name: 'Nawartu Demo'
      });
      setResults(prev => ({ ...prev, email: result }));
    } catch (error) {
      setResults(prev => ({ ...prev, email: { error: error.message } }));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const ResultDisplay = ({ result, title }) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      {result?.error ? (
        <div className="flex items-center text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{result.error}</span>
        </div>
      ) : result ? (
        <div className="flex items-start text-green-600">
          <CheckCircle className="w-5 h-5 mr-2 mt-0.5" />
          <pre className="text-sm bg-white p-2 rounded overflow-auto max-h-40">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">API Integration Demo</h1>
            <p className="text-green-100">Test Google Maps and EmailJS integrations - Ready to use!</p>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('google-maps')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'google-maps'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <MapPin className="w-5 h-5 inline mr-2" />
                Google Maps
              </button>
              <button
                onClick={() => setActiveTab('emailjs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'emailjs'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Mail className="w-5 h-5 inline mr-2" />
                EmailJS
              </button>

            </nav>
          </div>

          <div className="p-6">
            {/* Google Maps Tab */}
            {activeTab === 'google-maps' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Geocoding */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Search className="w-5 h-5 mr-2" />
                      Address Geocoding
                    </h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter address"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={testGeocode}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Geocode Address'}
                      </button>
                    </div>
                    <ResultDisplay result={results.geocode} title="Geocoding Result" />
                  </div>

                  {/* Reverse Geocoding */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Navigation className="w-5 h-5 mr-2" />
                      Reverse Geocoding
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          name="latitude"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          placeholder="Latitude"
                          step="any"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                        <input
                          type="number"
                          name="longitude"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          placeholder="Longitude"
                          step="any"
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <button
                        onClick={testReverseGeocode}
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Reverse Geocode'}
                      </button>
                    </div>
                    <ResultDisplay result={results.reverseGeocode} title="Reverse Geocoding Result" />
                  </div>
                </div>

                {/* Nearby Places */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Nearby Places
                  </h3>
                  <button
                    onClick={testNearbyPlaces}
                    disabled={loading}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Searching...' : 'Find Nearby Lodging'}
                  </button>
                  <ResultDisplay result={results.nearbyPlaces} title="Nearby Places Result" />
                </div>
              </div>
            )}

            {/* EmailJS Tab */}
            {activeTab === 'emailjs' && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Mail className="w-5 h-5 mr-2" />
                    Send Test Email
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Recipient email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Recipient name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Message content"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      onClick={sendTestEmail}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Test Email'}
                    </button>
                  </div>
                  <ResultDisplay result={results.email} title="Email Result" />
                </div>
              </div>
            )}


          </div>
        </div>

        {/* Environment Status */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Environment Status</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">Google Maps API Key</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${process.env.REACT_APP_EMAILJS_PUBLIC_KEY ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">EmailJS Public Key</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDemoPage;