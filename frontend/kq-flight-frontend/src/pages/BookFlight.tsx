// src/pages/BookFlight.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BookFlight.css';

interface Flight {
  flight_number: string;
  route: string;
  flight_class: string;
  price: number;
  image_url: string;
}

const BookFlight: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flightParam = new URLSearchParams(location.search).get('flight');
  const [flight, setFlight] = useState<Flight | null>(null);
  const [name, setName] = useState('');
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    if (flightParam) {
      axios.get(`http://127.0.0.1:5000/api/flights/flights`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then(res => {
          const selected = res.data.find((f: Flight) => f.flight_number === flightParam);
          if (selected) setFlight(selected);
        })
        .catch(err => console.error('Fetch failed:', err));
    }
  }, [flightParam]);

  const handleBooking = () => {
    if (!flight) return;

    axios.post(`http://127.0.0.1:5000/api/flights/flights/book`, {
      flight_number: flight.flight_number,
      passenger_name: name,
      seats_booked: seats
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        alert('Booking Successful!');
        navigate('/profile');
      })
      .catch(err => {
        console.error(err);
        alert('Booking failed');
      });
  };

  return (
    <div className="book-container">
      {flight ? (
        <div className="booking-card">
          <img src={flight.image_url} alt={flight.route} className="booking-image" />
          <div className="booking-details">
            <h2>{flight.route}</h2>
            <p><strong>Class:</strong> {flight.flight_class}</p>
            <p><strong>Price:</strong> ${flight.price.toFixed(2)}</p>

            <input
              type="text"
              placeholder="Passenger Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="number"
              min={1}
              placeholder="Seats"
              value={seats}
              onChange={e => setSeats(parseInt(e.target.value))}
            />
            <button onClick={handleBooking}>Confirm Booking</button>
          </div>
        </div>
      ) : (
        <p className="loading">Loading flight details...</p>
      )}
    </div>
  );
};

export default BookFlight;

