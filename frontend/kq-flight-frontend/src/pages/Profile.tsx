import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const response = await axios.get("http://127.0.0.1:5000/api/profile", config);
        setProfile(response.data);

        const qrResponse = await axios.get("http://127.0.0.1:5000/api/profile/qr", {
          headers: config.headers,
          responseType: "blob"
        });

        const qrUrl = URL.createObjectURL(qrResponse.data);
        setQrCodeUrl(qrUrl);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return <div className="loading">Loading profile...</div>;

  const usdBalance = (profile.balance * 2).toFixed(2); // Example rate

  return (
    <div className="profile-container">
      <div className="atm-card">
        {/* Left: Profile Info */}
        <div className="left-section">
          <img
            src={profile.profile_pic}
            alt="Profile"
            className="profile-pic"
          />
          <div className="user-info">
            <h3>{profile.username}</h3>
            <p className="email">{profile.email}</p>
            <div className="status">
              <span className="dot online"></span> Online
            </div>
            <div className="badge">✔ Verified</div>
          </div>
        </div>

        {/* Middle: Wallet and Balance */}
        <div className="middle-section">
          <div className="wallet-details">
            <div className="label">Wallet Address</div>
            <div className="value">{profile.wallet_address}</div>
          </div>

          <div className="balance-qr">
            <div className="balance-details">
              <div className="label">Balance</div>
              <div className="balance">{usdBalance} USD</div>
              <div className="subtext">≈ {profile.balance} KQCoin</div>
              <div className="miles">Miles Traveled: {profile.miles_traveled}</div>
            </div>
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" className="qr-img" />
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="right-section">
          <h3>Mining</h3>
          <div className="button-group">
            <button className="btn start">Start Mining</button>
            <button className="btn activity">View Activity</button>
          </div>
          <div className="phone">📱 {profile.phone_number}</div>
          <div className="role">🛡️ Role: {profile.role}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

