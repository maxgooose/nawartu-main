import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PropertyPage from './pages/PropertyPage';
import TripsPage from './pages/TripsPage';
import MyListingsPage from './pages/MyListingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/property/:id" element={<PropertyPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/my-listings" element={<MyListingsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
