import { useEffect, useState } from 'react';
import axios from 'axios';
import './SearchFlights.css'; // Optional: for styling

interface Flight {
  flight_number: string;
  route: string;
  flight_class: string;
  price: string;
  image_url: string;
}

export default function SearchFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view flights.");
          return;
        }

        const response = await axios.get("http://127.0.0.1:5000/api/flights/", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setFlights(response.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Failed to load flights.");
      }
    };

    fetchFlights();
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="flight-container">
      {flights.map((flight) => (
        <div key={flight.flight_number} className="flight-card">
          <img src={flight.image_url} alt={flight.route} className="flight-image" />
          <div className="flight-info">
            <h3>{flight.route}</h3>
            <p>Class: {flight.flight_class}</p>
            <p>Price: KES {flight.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

