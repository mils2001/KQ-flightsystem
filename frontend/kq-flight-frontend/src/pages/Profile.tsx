// src/pages/Profile.tsx
import React from 'react';
import './Profile.css';

const Profile: React.FC = () => {
  const user = {
    name: 'Christian David',
    email: 'chrismiles466@gmail.com',
    balance: 'KES 15,000',
    profilePic: 'https://i.imgur.com/V3Ei5vL.jpeg',
    status: 'online',
  };

  return (
    <div className="sidra-profile-container">
      <div className="sidra-profile-card">
        <div className="sidra-profile-top">
          <img src={user.profilePic} alt="Profile" className="sidra-profile-img" />
          <div className="sidra-profile-info">
            <h2>{user.name}</h2>
            <p className="sidra-email">{user.email}</p>
            <span className={`sidra-status ${user.status}`}>{user.status}</span>
          </div>
        </div>
        <div className="sidra-profile-details">
          <p><strong>Account Balance:</strong> {user.balance}</p>
          <button className="sidra-edit-btn">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

