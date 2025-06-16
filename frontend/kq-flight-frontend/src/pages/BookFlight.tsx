import React, { useState } from 'react';
import { bookFlight } from '../services/flightService';

const BookFlight: React.FC = () => {
  const [flightNumber, setFlightNumber] = useState('');
  const [seatsBooked, setSeatsBooked] = useState(1);
  const [passengerName, setPassengerName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBook = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await bookFlight({
        flight_number: flightNumber,
        seats_booked: seatsBooked,
        passenger_name: passengerName,
      });

      setMessage(response.message);
    } catch (err: any) {
      setError('Booking failed. Make sure flight number is correct and token is valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Book Flight</h2>

      <div className="flex flex-col gap-4 mb-4">
        <input
          className="p-2 border rounded"
          placeholder="Flight Number (e.g., KQ123)"
          value={flightNumber}
          onChange={(e) => setFlightNumber(e.target.value)}
        />
        <input
          className="p-2 border rounded"
          type="number"
          min="1"
          value={seatsBooked}
          onChange={(e) => setSeatsBooked(parseInt(e.target.value))}
        />
        <input
          className="p-2 border rounded"
          placeholder="Passenger Name"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
        />

        <button
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
          onClick={handleBook}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </div>

      {message && <div className="text-green-600">{message}</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
};

export default BookFlight;

