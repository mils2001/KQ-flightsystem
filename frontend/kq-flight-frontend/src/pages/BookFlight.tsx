import React, { useState } from 'react';
import { bookFlight } from '../services/flightService';

const BookFlight: React.FC = () => {
  const [formData, setFormData] = useState({
    flight_number: '',
    seats_booked: 1,
    passenger_name: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'seats_booked' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await bookFlight(formData);
      setMessage(`✅ ${response.message}`);
    } catch (err: any) {
      setError('❌ Failed to book flight. Please check the details and try again.');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🛫 Book a Flight</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="flight_number"
          placeholder="Flight Number (e.g., KQ123)"
          value={formData.flight_number}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          name="seats_booked"
          min="1"
          value={formData.seats_booked}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="passenger_name"
          placeholder="Passenger Name"
          value={formData.passenger_name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Book Flight
        </button>
      </form>

      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default BookFlight;

