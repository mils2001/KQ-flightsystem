import React, { useEffect, useState } from 'react';
import './Home.css';

const slides = [
  '/assets/slide1.jpg',
  '/assets/slide2.jpg',
  '/assets/slide3.jpg',
];

const tripDestinations = [
  { name: 'Nairobi', link: '/flights?to=Nairobi' },
  { name: 'Mombasa', link: '/flights?to=Mombasa' },
  { name: 'Dubai', link: '/flights?to=Dubai' },
  { name: 'London', link: '/flights?to=London' },
  { name: 'New York', link: '/flights?to=New%20York' },
];

const featureLinks = [
  { label: '📱 e-SIM Services', href: '/esim' },
  { label: '🏨 Hotels', href: '/hotels' },
  { label: '🚗 Car Rentals', href: '/car-rentals' },
];

const testimonials = [
  { name: 'Jane Mwangi', comment: 'The blockchain rewards are revolutionary!' },
  { name: 'John Doe', comment: 'Best airline experience I’ve ever had.' },
  { name: 'Amina Ali', comment: 'KQ-Coin made my trip even better. Love it!' },
];

const galleryImages = [
  { src: "https://i.imgur.com/jM4UrOZ.jpeg", alt: "Book Flights", label: "Book Flights", href: "/book" },
  { src: "https://i.imgur.com/w7nieOM.jpeg", alt: "Search Flights", label: "Search Flights", href: "/flights" },
  { src: "https://i.imgur.com/TJqDvUJ.jpeg", alt: "User Profile", label: "My Profile", href: "/profile" },
  { src: "https://i.imgur.com/EQQrLmX.jpeg", alt: "About Us", label: "About Us", href: "/about" },
  { src: "https://i.imgur.com/alZpv7R.jpeg", alt: "Contact Us", label: "Contact", href: "/contact" },
  { src: "https://i.imgur.com/MZvQ6HJ.jpeg", alt: "Private Flights", label: "Private Jet", href: "/private" },
  { src: "https://i.imgur.com/W3BaYTG.jpeg", alt: "Catering", label: "Catering", href: "/catering" },
  { src: "https://i.imgur.com/WIXdHTC.jpeg", alt: "Tours", label: "Tours", href: "/tours" },
  { src: "https://i.imgur.com/SqL4OEZ.jpeg", alt: "Holiday", label: "Holidays", href: "/holidays" },
];

const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [kqCoinValue, setKqCoinValue] = useState('$0.25');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const random = (0.20 + Math.random() * 0.1).toFixed(2);
      setKqCoinValue(`$${random}`);
    }, 5000);
    return () => clearInterval(interval);
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

      <div className="sidebar-feedback">
        <a href="/feedback">📝 Send Feedback</a>
      </div>

      <div className="home-content">
        <section className="mission" data-aos="fade-up">
          <h2>🚀 Our Mission</h2>
          <p>
            Kenya Airways is pioneering the first Web3-powered airline service with real rewards and next-gen features for modern travelers.
          </p>
        </section>

        <section className="features-table" data-aos="fade-up">
          <h2>🌍 Why Fly With Us?</h2>
          <table>
            <tbody>
              <tr><td>🏆 Award-winning service</td></tr>
              <tr><td>✈️ Global connectivity</td></tr>
              <tr><td>🛡️ Unmatched safety & comfort</td></tr>
              <tr><td>💰 Web3 rewards through KQ-COIN</td></tr>
              <tr><td>🔗 Blockchain tech integration</td></tr>
            </tbody>
          </table>
        </section>

        <section className="gallery" data-aos="zoom-in">
          <h2>📸 Explore Our Experience</h2>
          <div className="gallery-images">
            {galleryImages.map(({ src, alt, label, href }, i) => (
              <a href={href} key={i} className="gallery-item">
                <img src={src} alt={alt} />
                <span className="gallery-label">{label}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="feature-icons" data-aos="fade-up">
          <h2>🧰 Additional Services</h2>
          <div className="feature-buttons">
            {featureLinks.map((feature, i) => (
              <a key={i} href={feature.href} className="feature-button">
                {feature.label}
              </a>
            ))}
          </div>
        </section>

        <section className="trip-planner" data-aos="fade-up">
          <h2>🧭 Plan Your Trip</h2>
          <p>Choose a destination to start planning your journey:</p>
          <table className="trip-table">
            <thead>
              <tr>
                <th>Destination</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tripDestinations.map((trip, index) => (
                <tr key={index}>
                  <td>{trip.name}</td>
                  <td><a href={trip.link} className="trip-link">Book Now</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="kq-coin-stats" data-aos="zoom-in">
          <h2>💸 Live KQ-COIN Value</h2>
          <p>Current Value: <strong>{kqCoinValue}</strong></p>
        </section>

        <section className="testimonials" data-aos="fade-up">
          <h2>🗣️ What Our Travelers Say</h2>
          <div className="testimonial-list">
            {testimonials.map((t, i) => (
              <blockquote key={i}>
                <p>“{t.comment}”</p>
                <footer>- {t.name}</footer>
              </blockquote>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;

