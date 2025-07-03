import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [claimCooldown, setClaimCooldown] = useState<number>(0);
  const [usdBalance, setUsdBalance] = useState<string>("0.00");

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

        const usdRate = 1.5;
        setUsdBalance((response.data.balance * usdRate).toFixed(2));

        const lastClaim = localStorage.getItem("lastClaim");
        if (lastClaim) {
          const timeDiff = 86400000 - (Date.now() - parseInt(lastClaim));
          if (timeDiff > 0) setClaimCooldown(Math.floor(timeDiff / 1000));
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setClaimCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const claimKQCoin = () => {
    if (claimCooldown > 0) return alert("Please wait before claiming again.");
    setProfile({ ...profile, balance: profile.balance + 2 });
    localStorage.setItem("lastClaim", Date.now().toString());
    setClaimCooldown(86400); // 24hr in seconds
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        alert(`Connected to Metamask: ${accounts[0]}`);
      } catch (error) {
        console.error("Metamask connection failed", error);
      }
    } else {
      alert("Metamask not installed.");
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  if (!profile) return <div className="loading">Loading profile...</div>;

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="atm-card">
          <div className="atm-left">
            <img
              src={profile.profile_pic || "https://i.imgur.com/7ZVofHE.jpeg"}
              alt="Profile"
              className="profile-pic"
            />
            <div className="user-info">
              <h2>{profile.full_name || "User Name"}</h2>
              <p className="email">{profile.email}</p>
              {profile.is_verified && <span className="verified-badge">✔ Verified</span>}
            </div>
          </div>
          <div className="atm-right">
            <img src={qrCodeUrl} alt="QR Code" className="atm-qr" />
            <p className="user-id">ID: {profile.user_id || "N/A"}</p>
          </div>
        </div>

        <div className="wallet-overview">
          <div className="wallet-info">
            <h3>KQCoin Wallet</h3>
            <p><strong>Balance:</strong> {profile.balance} KQCoin</p>
            <p><strong>USD Value:</strong> ~${usdBalance} USD</p>
            <p><strong>Wallet:</strong> {profile.wallet_address}</p>
            <button
              className="claim-btn"
              onClick={claimKQCoin}
              disabled={claimCooldown > 0}
            >
              {claimCooldown > 0 ? `Next Claim in ${formatTime(claimCooldown)}` : "Claim 2 KQCoin"}
            </button>
          </div>

          <div className="wallet-actions">
            <button className="btn connect" onClick={connectWallet}>Connect MetaMask</button>
            <button className="btn send">Send KQCoin</button>
            <button className="btn redeem">Redeem for Flight</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

