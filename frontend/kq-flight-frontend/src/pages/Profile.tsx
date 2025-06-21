import React, { useEffect, useState } from 'react';
import { getUserProfile } from '../services/profileService';


interface UserProfile {
  id: number;
  username: string;
  phone: string;
  balance: number;
  profile_picture: string | null;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 Welcome, {user.username}</h1>
      {user.profile_picture && (
        <img
          src={user.profile_picture}
          alt="Profile"
          className="w-32 h-32 rounded-full mb-4 object-cover border"
        />
      )}
      <p><strong>📞 Phone:</strong> {user.phone}</p>
      <p><strong>💳 Balance:</strong> KES {user.balance}</p>

      <div className="mt-6">
        <label className="block mb-2">Upload New Profile Picture</label>
        <input type="file" />
        {/* Upload logic will come later */}
      </div>
    </div>
  );
};

export default Profile;
