// profileService.ts
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/profile';

const getToken = () => localStorage.getItem('token');

export const getUserProfile = async () => {
  const token = getToken();
  const response = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  
