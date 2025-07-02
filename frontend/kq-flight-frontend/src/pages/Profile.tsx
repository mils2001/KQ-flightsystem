import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

interface UserProfile {
  username: string;
  email: string;
  phone_number: string;
  profile_pic_url: string;
  balance: string;
  miles_traveled: number;
  wallet_address: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    axios.get("/api/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <img
          src={user.profile_pic_url || "/default-profile.jpg"}
          alt="Profile"
          className="profile-pic"
        />
        <h2>{user.username}</h2>
        <p>{user.email}</p>
        <p>{user.phone_number}</p>
        <p className="role-badge">{user.role}</p>

        <img
          src="/api/profile/qr"
          alt="User QR Code"
          className="qr-code"
        />
      </div>

      <div className="profile-card">
        <h3>Account Card</h3>
        <div className="atm-card">
          <div className="balance-section">
            <p>Balance</p>
            <h2>KES {user.balance}</h2>
          </div>
          <div className="miles-wallet">
            <p>Miles: {user.miles_traveled}</p>
            <p>Wallet: <span className="wallet">{user.wallet_address || "N/A"}</span></p>
          </div>
        </div>

        <div className="actions">
          <button>Start Mining</button>
          <button>Edit Profile</button>
        </div>
      </div>
    </div>
  );
}

