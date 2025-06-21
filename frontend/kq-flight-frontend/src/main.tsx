// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

import App from './App';
import SearchFlights from './pages/SearchFlights';
import BookFlight from './pages/BookFlight';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';

const Root = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/login'; // hide navbar on login page

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/search"
          element={
            <PrivateRoute>
              <SearchFlights />
            </PrivateRoute>
          }
        />
        <Route
          path="/book"
          element={
            <PrivateRoute>
              <BookFlight />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Root />
    </Router>
  </React.StrictMode>
);

