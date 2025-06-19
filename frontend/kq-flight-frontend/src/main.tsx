// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

import App from './App';
import SearchFlights from './pages/SearchFlights';
import BookFlight from './pages/BookFlight';
import Profile from './pages/Profile';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      {/* Simple Navbar */}
      <nav className="p-4 bg-gray-800 text-white flex gap-6 text-lg">
        <Link to="/">Home</Link>
        <Link to="/search">Search Flights</Link>
        <Link to="/book">Book Flight</Link>
        <Link to="/profile">Profile</Link>
      </nav>

      {/* Page Routes */}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/search" element={<SearchFlights />} />
        <Route path="/book" element={<BookFlight />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

