// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './index.css';

import App from './App';
import SearchFlights from './pages/SearchFlights';
import BookFlight from './pages/BookFlight';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      {/* Simple Navbar */}
      <Navbar/>

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

