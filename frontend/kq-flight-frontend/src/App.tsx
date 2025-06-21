// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchFlights from './pages/SearchFlights';
import BookFlight from './pages/BookFlight';
import Profile from './pages/Profile';
import Login from './pages/Login'; // create if not already

const App: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchFlights />} />
        <Route path="/book" element={<BookFlight />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;

