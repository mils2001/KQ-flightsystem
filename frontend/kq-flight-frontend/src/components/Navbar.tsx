// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isDark, setIsDark] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle("dark-mode", !isDark);
  };

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

        {/* Theme Toggle Button */}
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? '☀️' : '🌙'}
        </button>

        {/* Settings Dropdown */}
        <div className="settings">
          <span onClick={() => setShowSettings(!showSettings)}>⚙️</span>
          {showSettings && (
            <div className="settings-dropdown">
              <Link to="/settings/theme">🌗 Change Theme</Link>
              <Link to="/settings/currency">💱 Change Currency</Link>
              <Link to="/settings/password">🔐 Change Password</Link>
              <Link to="/settings/scan">📷 Scan Login Link</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

