import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookFlight.css";
import AOS from "aos";
import "aos/dist/aos.css";

const imageSlides = [
  "https://i.imgur.com/jM4UrOZ.jpeg",
  "https://i.imgur.com/w7nieOM.jpeg",
  "https://i.imgur.com/TJqDvUJ.jpeg",
  "https://i.imgur.com/EQQrLmX.jpeg",
  "https://i.imgur.com/alZpv7R.jpeg",
];

const marketingTexts = [
  "Fly with Confidence",
  "Book your next trip effortlessly",
  "Seamless booking with Web3 security",
  "Explore East Africa with ease",
  "Affordable luxury in the skies",
];

const services = [
  { image: "https://i.imgur.com/1a1pw7M.jpeg", title: "Baggage Info", link: "/baggage" },
  { image: "https://i.imgur.com/1aMHtHV.jpeg", title: "Search Holidays", link: "/search" },
  { image: "https://i.imgur.com/dupHQnG.jpeg", title: "Visa Requirements", link: "/visa" },
  { image: "https://i.imgur.com/fhK5MvR.jpeg", title: "Travel Guidelines", link: "/guidelines" },
];

const BookFlight: React.FC = () => {
  const [flights, setFlights] = useState<any[]>([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [tripType, setTripType] = useState("oneway");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengerName, setPassengerName] = useState("");
  const [seats, setSeats] = useState(1);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userBalance, setUserBalance] = useState(1000);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    AOS.init({ duration: 800 });
    axios
      .get("http://127.0.0.1:5000/api/flights")
      .then((res) => setFlights(res.data.flights || res.data))
      .catch((err) => console.error("Error fetching flights", err));
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageSlides.length);
      setCurrentText((prev) => (prev + 1) % marketingTexts.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  const handleBooking = async () => {
    if (!origin || !destination || !departureDate || !passengerName || seats <= 0) {
      setError("Please fill in all required fields.");
      return;
    }

    const match = flights.find((f) => {
      const [flightOrigin, flightDestination] = f.route
        .split(" to ")
        .map((s: string) => s.trim().toLowerCase());
      return (
        flightOrigin === origin.trim().toLowerCase() &&
        flightDestination === destination.trim().toLowerCase()
      );
    });

    if (!match) {
      setError("No available flights for this route.");
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:5000/api/book",
        {
          user_id: userId,
          origin,
          destination,
          trip_type: tripType,
          departure_date: departureDate,
          return_date: tripType === "roundtrip" ? returnDate : null,
          passenger_name: passengerName,
          seats,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setBookingSuccess(true);
      setError("");
    } catch (err) {
      console.error("Booking failed", err);
      setError("Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-page dark-theme">
      {/* Slideshow */}
      <div className="slideshow" data-aos="fade-in">
        <img src={imageSlides[currentSlide]} alt="slide" className="slide-image" />
        <div className="marketing-text">
          <h1>{marketingTexts[currentText]}</h1>
          <p>First Web3-powered African airline</p>
        </div>
      </div>

      {/* Booking Section */}
      <div className="booking-section" data-aos="fade-up">
        <h2>🛫 Book Your Flight</h2>
        <p className="user-balance">Wallet Balance: ${userBalance}</p>
        <div className="form-grid">
          <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Where from?" />
          <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Where to?" />
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            <option value="oneway">One Way</option>
            <option value="roundtrip">Round Trip</option>
          </select>
          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
          {tripType === "roundtrip" && (
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          )}
          <input type="text" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} placeholder="Passenger Name" />
          <input type="number" min="1" value={seats} onChange={(e) => setSeats(Number(e.target.value))} placeholder="Seats" />
          <button onClick={handleBooking}>Confirm Booking</button>
        </div>
        {error && <p className="error">{error}</p>}
        {bookingSuccess && <p className="success">🎉 Booking confirmed successfully!</p>}
      </div>

      {/* How to Book Section */}
      <div className="how-to-book" data-aos="fade-right">
        <h2>✈️ How to Book a Flight</h2>
        <ol>
          <li>Enter your origin and destination cities.</li>
          <li>Select trip type: One Way or Round Trip.</li>
          <li>Choose departure (and return) date.</li>
          <li>Fill in passenger details.</li>
          <li>Click <strong>Confirm Booking</strong>.</li>
        </ol>
      </div>

      {/* Services Section */}
      <div className="extras-section" data-aos="fade-left">
        <h2>🧳 Additional Services</h2>
        <div className="services-grid">
          {services.map((s, idx) => (
            <a href={s.link} key={idx} className="service-card">
              <img src={s.image} alt={s.title} />
              <h4>{s.title}</h4>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookFlight;

