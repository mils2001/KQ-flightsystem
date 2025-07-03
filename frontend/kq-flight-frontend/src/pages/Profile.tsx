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
      setClaimCooldown(prev => (prev > 0 ? prev - 1 : 0));
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

        {/* LEFT SECTION */}
        <div className="left-section">
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
          <div className="email">{profile.email}</div>
        </div>

        {/* RIGHT SECTION */}
        <div className="right-section">
          <div className="wallet-card">
            <div className="card-header">Wallet Address</div>
            <div className="card-body">{profile.wallet_address}</div>
            <img src={qrCodeUrl} alt="QR Code" className="qr-img" />
          </div>

          <div className="balance-card">
            <h3>Balance</h3>
            <p>{profile.balance} KQCoin</p>
            <p>~ ${usdBalance} USD</p>
            <button
              className="claim-btn"
              onClick={claimKQCoin}
              disabled={claimCooldown > 0}
            >
              {claimCooldown > 0
                ? `Next Claim in ${formatTime(claimCooldown)}`
                : "Claim 2 KQCoin"}
            </button>
          </div>

          <div className="mining-card">
            <h3>Mining Options</h3>
            <div className="button-group">
              <button className="btn start">Start Mining</button>
              <button className="btn connect" onClick={connectWallet}>
                Connect MetaMask
              </button>
              <button className="btn activity">View Activity</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;

