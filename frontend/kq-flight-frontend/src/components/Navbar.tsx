// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Kenya Airways ✈️</h1>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search Flights</Link>
        <Link to="/book">Book Flight</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/login" className="login-btn">Login</Link>
        <Link to="/signup" className="signup-btn">Sign Up</Link>
      </div>
    </nav>
  );
};

export default Navbar;

