import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/HomePage';
import PropertyPage from './pages/PropertyPage';
import TripsPage from './pages/TripsPage';
import MyListingsPage from './pages/MyListingsPage';
import HostDashboardPage from './pages/HostDashboardPage';
import AdminDashboard from './pages/AdminDashboard';
import APIDemoPage from './pages/APIDemoPage';
import SimpleAPITest from './pages/SimpleAPITest';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import './i18n'; // Import i18n configuration

function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/property/:id" element={<PropertyPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/my-listings" element={<MyListingsPage />} />
              <Route path="/host/dashboard" element={<HostDashboardPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
                             <Route path="/contact" element={<ContactPage />} />
               <Route path="/terms" element={<TermsPage />} />
               <Route path="/privacy" element={<PrivacyPage />} />
               <Route path="/api-demo" element={<APIDemoPage />} />
               <Route path="/api-test" element={<SimpleAPITest />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </Router>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
