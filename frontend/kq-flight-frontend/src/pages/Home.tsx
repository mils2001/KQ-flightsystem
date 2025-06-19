// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import './Home.css';

const slides = [
  '/assets/slide1.jpg',
  '/assets/slide2.jpg',
  '/assets/slide3.jpg',
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // Flip every 4 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home-container">
      <div className="hero-slideshow">
        <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
        <div className="hero-text">
          <h1>Welcome to Kenya Airways ✈️</h1>
          <p>Fly with Africa’s finest. Explore 50+ global destinations!</p>
        </div>
      </div>

      <div className="home-content">
        <div className="button-group">
          <button>🎟️ Book a Flight</button>
          <button>🔍 Search Flights</button>
          <button>📞 Contact Us</button>
        </div>

        <div className="features">
          <h2>🌍 Why Fly With Us?</h2>
          <ul>
            <li>🏆 Award-winning service</li>
            <li>✈️ Global connectivity</li>
            <li>🛡️ Unmatched safety & comfort</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;

