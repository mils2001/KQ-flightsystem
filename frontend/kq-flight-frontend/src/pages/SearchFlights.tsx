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
  rating: number;
}

export default function SearchFlights() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('');
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
          headers: { Authorization: `Bearer ${token}` },
        });

        setFlights(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load flights.");
      }
    };

    fetchFlights();
  }, []);

  const handleCardClick = (flight: Flight) => {
    const confirmBook = window.confirm(
      `✈️ Destination: ${flight.route}\n📦 Class: ${flight.flight_class}\n💵 Price: USD ${flight.price}`
    );
    if (confirmBook) {
      navigate(`/book/${flight.flight_number}`);
    }
  };

  const getSortedFlights = () => {
    let sorted = [...flights];
    if (sortOption === 'price-asc') {
      sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOption === 'price-desc') {
      sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortOption === 'class') {
      sorted.sort((a, b) => a.flight_class.localeCompare(b.flight_class));
    }

    return sorted.filter(flight =>
      flight.route.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.floor(rating));
  };

  return (
    <div className={`flight-container ${darkMode ? 'dark' : ''}`}>
      <div className="top-bar">
        <input
          type="text"
          placeholder="🔍 Search by destination..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price-asc">💲 Price: Low to High</option>
          <option value="price-desc">💰 Price: High to Low</option>
          <option value="class">🎟️ Flight Class</option>
        </select>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="flight-grid">
        {getSortedFlights().map((flight) => (
          <div
            key={flight.flight_number}
            className="flight-card"
            onClick={() => handleCardClick(flight)}
          >
            <img src={flight.image_url} alt={flight.route} className="flight-image" />
            <div className="flight-info">
              <h3>{flight.route}</h3>
              <p><strong>Class:</strong> {flight.flight_class}</p>
              <p><strong>Price:</strong> USD {flight.price}</p>
              <p className="stars">{renderStars(flight.rating)}</p>

              <div className="services">
                <strong>�� Services:</strong>
                {flight.flight_class === 'Business' && (
                  <ul><li>🛋️ Free Lounge</li><li>🍾 Champagne</li><li>�� Wi-Fi</li></ul>
                )}
                {flight.flight_class === 'Economy' && (
                  <ul><li>🍿 Snacks</li><li>🧳 Free Luggage</li></ul>
                )}
                {flight.flight_class === 'Regular' && (
                  <ul><li>🎒 1 Carry-on</li><li>🍽️ Paid Meals</li></ul>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

