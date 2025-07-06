// src/pages/Settings.tsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <section>
        <h3>Theme</h3>
        <p>Current theme: <strong>{theme}</strong></p>
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'dark' : 'light'} mode
        </button>
      </section>

      <section>
        <h3>Account</h3>
        <p>You are logged in.</p>
        <button onClick={handleLogout}>Logout</button>
      </section>
    </div>
  );
};

export default Settings;

