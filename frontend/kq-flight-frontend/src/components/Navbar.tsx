// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="logo">Kenya Airways ✈️</div>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/search">Search Flights</Link>
        <Link to="/book">Book Flight</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <div className="nav-actions">
        <button className="login-btn">Login</button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
};

export default Navbar;
