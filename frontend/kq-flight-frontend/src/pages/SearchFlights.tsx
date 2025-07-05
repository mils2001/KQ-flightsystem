import { useEffect, useState } from 'react';
import axios from 'axios';
import './SearchFlights.css';
import { useNavigate } from 'react-router-dom';

interface Flight {
  flight_number: string;
  route: string;
  flight_class: string;
  price: string;
  image_url: string;
}

export default function SearchFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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
            Authorization: `Bearer ${token}`,
          },
        });

        setFlights(response.data);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Failed to load flights.");
      }
    };

    fetchFlights();
  }, []);

  const handleCardClick = (flight: Flight) => {
    const confirmBook = window.confirm(
      `Destination: ${flight.route}\nClass: ${flight.flight_class}\nPrice: USD ${flight.price}\n\nWould you like to book this ticket?`
    );
    if (confirmBook) {
      navigate(`/book/${flight.flight_number}`);
    }
  };

  const filteredFlights = flights.filter(flight =>
    flight.route.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flight-container ${darkMode ? 'dark' : ''}`}>
      <div className="top-bar">
        <input
          type="text"
          placeholder="Search by route..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredFlights.map((flight) => (
        <div
          key={flight.flight_number}
          className="flight-card"
          onClick={() => handleCardClick(flight)}
        >
          <img src={flight.image_url} alt={flight.route} className="flight-img" />
          <div className="flight-info">
            <h3>{flight.route}</h3>
            <p>Class: {flight.flight_class}</p>
            <p>Price: USD {flight.price}</p>

            <div className="services">
              <strong>Services:</strong>
              {flight.flight_class === 'Business' && <ul><li>Free Lounge</li><li>Champagne</li><li>Wi-Fi</li></ul>}
              {flight.flight_class === 'Economy' && <ul><li>Snacks</li><li>Free Luggage</li></ul>}
              {flight.flight_class === 'Regular' && <ul><li>1 Carry-on</li><li>Paid Meals</li></ul>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

