import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000/api/flights';

export const getAllFlights = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(BASE_URL + '/', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


