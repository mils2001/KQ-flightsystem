import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Update if hosted elsewhere

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// ==========================
// 🔍 SEARCH FLIGHTS
// ==========================
export const searchFlights = async (params: {
  route: string;
  date?: string;
  class_type?: string;
}) => {
  const token = getToken();

  const response = await axios.get(`${API_URL}/flights/search`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return response.data;
};

// ==========================
// 🛫 BOOK FLIGHT
// ==========================
export const bookFlight = async (data: {
  flight_number: string;
  seats_booked: number;
  passenger_name: string;
}) => {
  const token = getToken();

  const response = await axios.post(`${API_URL}/flights/book`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
