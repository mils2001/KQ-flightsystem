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

  const usdRate = 1.5; // Example conversion rate
  const usdBalance = (profile.balance * usdRate).toFixed(2);

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* LEFT SIDE */}
        <div className="profile-left">
          <img
            src={profile.profile_pic || "https://i.imgur.com/7ZVofHE.jpeg"}
            alt="Profile"
            className="profile-pic"
          />
          <div className="badges">
            <span className={`status ${profile.status === "online" ? "online" : "offline"}`}>
              {profile.status}
            </span>
            {profile.is_verified && <span className="verified">✔ Verified</span>}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">
          <div className="welcome">
            <div className="subtext">Welcome back,</div>
            <div className="email">{profile.email}</div>
          </div>

          <div className="wallet-card">
            <div className="label">Wallet Address</div>
            <div className="value">{profile.wallet_address}</div>
          </div>

          <div className="balance-qr">
            <div className="balance-section">
              <div className="label">Balance</div>
              <div className="balance">
                {profile.balance} KQCoin <br />
                (~ ${usdBalance} USD)
              </div>
            </div>
            {qrCodeUrl && (
              <img src={qrCodeUrl} alt="QR Code" className="qr-img" />
            )}
          </div>

          <div className="mining-card">
            <h3>Mining</h3>
            <div className="button-group">
              <button className="btn start">Start Mining</button>
              <button className="btn activity">View Activity</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

