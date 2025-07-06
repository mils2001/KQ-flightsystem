// src/pages/Home.tsx
import React, { useEffect, useState } from 'react';
import './Home.css';

const slides = [
  '/assets/slide1.jpg',
  '/assets/slide2.jpg',
  '/assets/slide3.jpg',
];

const galleryImages = [
  'https://i.imgur.com/jM4UrOZ.jpeg',
  'https://i.imgur.com/w7nieOM.jpeg',
  'https://i.imgur.com/TJqDvUJ.jpeg',
  'https://i.imgur.com/EQQrLmX.jpeg',
  'https://i.imgur.com/alZpv7R.jpeg',
  'https://i.imgur.com/jcAPrzO.jpeg',
  'https://i.imgur.com/GvUbhyW.jpeg',
  'https://i.imgur.com/MZvQ6HJ.jpeg',
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`home-container ${darkMode ? 'dark' : ''}`}>
      <button className="darkmode-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>

      <div className="hero-slideshow">
        <img src={slides[currentSlide]} alt={`Slide ${currentSlide + 1}`} />
        <div className="hero-text">
          <h1>Welcome to Kenya Airways ✈️</h1>
          <p>Fly with Africa’s finest. Explore 50+ global destinations!</p>
        </div>
      </div>

      <div className="home-content">
        <div className="mission">
          <h2>🚀 Our Mission</h2>
          <p>
            Kenya Airways is pioneering the first Web3-powered airline service. 
            We provide global flight services while rewarding our clients through our native token — <strong>KQ-COIN</strong>. 
            As we integrate blockchain into aviation, KQ-COIN will empower users to earn, trade, and redeem rewards globally. 
            We are currently in our integration stages, targeting launches on major exchanges including Binance, OKX, and Bitget. 
            Join us on this innovative journey!
          </p>
        </div>

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
            <li>💰 Web3 rewards through KQ-COIN</li>
            <li>🔗 Upcoming integration with blockchain technology</li>
          </ul>
        </div>

        <div className="gallery">
          <h2>📸 Explore Our Experience</h2>
          <div className="gallery-images">
            {galleryImages.map((img, index) => (
              <img key={index} src={img} alt={`Gallery ${index + 1}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


