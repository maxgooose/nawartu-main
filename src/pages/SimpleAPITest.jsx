import React, { useState, useEffect } from 'react';
import { MapPin, Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const SimpleAPITest = () => {
  const [results, setResults] = useState({
    environment: null,
    googleMaps: null,
    emailjs: null
  });
  const [loading, setLoading] = useState({
    environment: false,
    googleMaps: false,
    emailjs: false,
    all: false
  });

  // Test environment variables
  const testEnvironment = () => {
    setLoading(prev => ({ ...prev, environment: true }));
    
    setTimeout(() => {
      const envResult = {
        googleMapsKey: !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        emailjsPublicKey: !!process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
        emailjsPrivateKey: !!process.env.REACT_APP_EMAILJS_PRIVATE_KEY,
        emailjsServiceId: !!process.env.REACT_APP_EMAILJS_SERVICE_ID,
        emailjsTemplateId: !!process.env.REACT_APP_EMAILJS_TEMPLATE_ID
      };

      const allPresent = Object.values(envResult).every(Boolean);
      
      setResults(prev => ({
        ...prev,
        environment: {
          success: allPresent,
          details: envResult,
          message: allPresent ? 'All environment variables are set' : 'Some environment variables are missing'
        }
      }));
      setLoading(prev => ({ ...prev, environment: false }));
    }, 1000);
  };

  // Test Google Maps
  const testGoogleMaps = async () => {
    setLoading(prev => ({ ...prev, googleMaps: true }));
    
    try {
      if (!process.env.REACT_APP_GOOGLE_MAPS_API_KEY) {
        throw new Error('Google Maps API key not found in environment variables');
      }

      // Try to load the Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      
      const loadPromise = new Promise((resolve, reject) => {
        script.onload = () => resolve('Google Maps script loaded successfully');
        script.onerror = () => reject(new Error('Failed to load Google Maps script'));
        setTimeout(() => reject(new Error('Google Maps script load timeout')), 10000);
      });

      document.head.appendChild(script);
      const message = await loadPromise;
      
      setResults(prev => ({
        ...prev,
        googleMaps: {
          success: true,
          message,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        googleMaps: {
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, googleMaps: false }));
    }
  };

  // Test EmailJS
  const testEmailJS = async () => {
    setLoading(prev => ({ ...prev, emailjs: true }));
    
    try {
      if (!process.env.REACT_APP_EMAILJS_PUBLIC_KEY) {
        throw new Error('EmailJS public key not found in environment variables');
      }

      // Try to initialize EmailJS
      const { default: emailjs } = await import('@emailjs/browser');
      emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
      
      setResults(prev => ({
        ...prev,
        emailjs: {
          success: true,
          message: 'EmailJS initialized successfully',
          timestamp: new Date().toISOString(),
          note: 'Ready to send emails (service ID and template ID required for actual sending)'
        }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        emailjs: {
          success: false,
          message: error.message,
          timestamp: new Date().toISOString()
        }
      }));
    } finally {
      setLoading(prev => ({ ...prev, emailjs: false }));
    }
  };

  // Run all tests
  const runAllTests = async () => {
    setLoading(prev => ({ ...prev, all: true }));
    
    testEnvironment();
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    await testGoogleMaps();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testEmailJS();
    
    setLoading(prev => ({ ...prev, all: false }));
  };

  // Auto-run environment test on component mount
  useEffect(() => {
    testEnvironment();
  }, []);

  const ResultCard = ({ title, result, isLoading, onTest, icon: Icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Icon className="w-5 h-5 mr-2 text-gray-600" />
          {title}
        </h3>
        <button
          onClick={onTest}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test'
          )}
        </button>
      </div>
      
      {result && (
        <div className={`p-4 rounded-lg border-l-4 ${
          result.success 
            ? 'bg-green-50 border-green-400' 
            : 'bg-red-50 border-red-400'
        }`}>
          <div className="flex items-start">
            {result.success ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                {result.message}
              </p>
              {result.note && (
                <p className="text-sm text-gray-600 mt-1">{result.note}</p>
              )}
              {result.details && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">Details:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {Object.entries(result.details).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        <div className={`w-2 h-2 rounded-full mr-2 ${value ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {key}: {value ? 'Present' : 'Missing'}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {result.timestamp && (
                <p className="text-xs text-gray-500 mt-2">
                  Tested at: {new Date(result.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">API Integration Test</h1>
          <p className="text-gray-600">Quick verification of Google Maps and EmailJS integrations</p>
        </div>

        {/* Run All Tests Button */}
        <div className="text-center mb-8">
          <button
            onClick={runAllTests}
            disabled={loading.all}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
          >
            {loading.all ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Running All Tests...
              </>
            ) : (
              'Run All Tests'
            )}
          </button>
        </div>

        {/* Test Cards */}
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ResultCard
            title="Environment Variables"
            result={results.environment}
            isLoading={loading.environment}
            onTest={testEnvironment}
            icon={CheckCircle}
          />
          
          <ResultCard
            title="Google Maps API"
            result={results.googleMaps}
            isLoading={loading.googleMaps}
            onTest={testGoogleMaps}
            icon={MapPin}
          />
          
          <ResultCard
            title="EmailJS Service"
            result={results.emailjs}
            isLoading={loading.emailjs}
            onTest={testEmailJS}
            icon={Mail}
          />
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Testing Instructions</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">What this page tests:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Environment variable presence</li>
                <li>• Google Maps script loading</li>
                <li>• EmailJS initialization</li>
                <li>• API key validity (basic check)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">Next steps if tests pass:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Visit the <a href="/api-demo" className="text-green-600 hover:underline">API Demo page</a> for full testing</li>
                <li>• Test actual geocoding and email sending</li>
                <li>• Configure EmailJS service and template IDs</li>
                <li>• Add SMS.to API key when available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAPITest;