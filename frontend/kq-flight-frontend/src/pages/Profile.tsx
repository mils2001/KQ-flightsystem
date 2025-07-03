import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [conversionRate, setConversionRate] = useState<number>(1.5);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const response = await axios.get("http://127.0.0.1:5000/api/profile", config);
        setProfile(response.data);

        const qrResponse = await axios.get("http://127.0.0.1:5000/api/profile/qr", {
          headers: config.headers,
          responseType: "blob",
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

  const usdBalance = (profile.balance * conversionRate).toFixed(2);

  return (
    <div className="profile-container">
      <div className="atm-card">
        {/* Profile Section */}
        <div className="left-section">
          <img
            src={profile.profile_pic || "https://i.imgur.com/7ZVofHE.jpeg"}
            alt="Profile"
            className="profile-pic"
          />
          <div className="name">{profile.name || "User Name"}</div>
          <div className="email">{profile.email}</div>
          <div className="status-badges">
            <span className={`status ${profile.status === "online" ? "online" : "offline"}`}>
              {profile.status}
            </span>
            {profile.is_verified && <span className="verified">✔ Verified</span>}
          </div>
        </div>

        {/* Wallet + QR */}
        <div className="middle-section">
          <div className="wallet-address">
            <label>Wallet</label>
            <div>{profile.wallet_address}</div>
          </div>

          <div className="balance-section">
            <div className="balance">
              <strong>{profile.balance} KQCoin</strong>
              <div className="usd">≈ ${usdBalance} USD</div>
            </div>

            <div className="convert-box">
              <label>Conversion Rate (USD):</label>
              <input
                type="number"
                value={conversionRate}
                onChange={(e) => setConversionRate(parseFloat(e.target.value))}
              />
            </div>

            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="qr-img" />}
          </div>
        </div>

        {/* Mining + Timer */}
        <div className="right-section">
          <h3>⛏ Mining</h3>
          <div className="button-group">
            <button className="btn start">Start Mining</button>
            <button className="btn activity">View Activity</button>
          </div>
          <div className="timer">
            Next Mining In: <span className="countdown">00:12:34</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

