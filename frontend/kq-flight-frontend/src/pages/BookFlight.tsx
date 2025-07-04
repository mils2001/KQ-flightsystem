import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BookFlight.css";

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
  {
    image: "https://i.imgur.com/1a1pw7M.jpeg",
    title: "Baggage Information",
  },
  {
    image: "https://i.imgur.com/1aMHtHV.jpeg",
    title: "Search Holidays",
  },
  {
    image: "https://i.imgur.com/dupHQnG.jpeg",
    title: "Visa Requirements",
  },
  {
    image: "https://i.imgur.com/fhK5MvR.jpeg",
    title: "Travel Guidelines",
  },
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
    if (!origin || !destination || !departureDate || !passengerName || seats < 1) {
      setError("Please fill in all required fields.");
      return;
    }

    const match = flights.find(f => {
      const [flightOrigin, flightDestination] = f.route.split(" to ").map((s: string) => s.trim().toLowerCase());
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

  const destinations = flights.map((f) => ({
    route: f.route,
    price: f.price,
    image: f.image_url || imageSlides[Math.floor(Math.random() * imageSlides.length)],
  }));

  return (
    <div className="booking-page dark-theme">
      {/* Slideshow */}
      <div className="slideshow">
        <img src={imageSlides[currentSlide]} alt="slide" className="slide-image" />
        <div className="marketing-text">
          <h1>{marketingTexts[currentText]}</h1>
          <p>First Web3-powered African airline</p>
        </div>
      </div>

      {/* Booking Section */}
      <div className="booking-section">
        <h2>🛫 Book Your Flight</h2>
        <p className="user-balance">Wallet Balance: ${userBalance}</p>
        <div className="form-grid column-2">
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Where from?"
          />

          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Where to?"
          />

          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            <option value="oneway">One Way</option>
            <option value="roundtrip">Round Trip</option>
          </select>

          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />

          {tripType === "roundtrip" && (
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          )}

          <input
            type="text"
            value={passengerName}
            onChange={(e) => setPassengerName(e.target.value)}
            placeholder="Passenger name"
          />

          <input
            type="number"
            min="1"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            placeholder="Seats"
          />

          <button onClick={handleBooking}>Confirm Booking</button>
        </div>

        {error && <p className="error">{error}</p>}
        {bookingSuccess && <p className="success">🎉 Booking confirmed successfully!</p>}
      </div>

      {/* Destination Section */}
      <div className="destination-section">
        <h2>🌍 Popular Destinations</h2>
        <div className="destination-grid row-2">
          {destinations.map((dest, idx) => (
            <div key={idx} className="destination-card">
              <img src={dest.image} alt={dest.route} />
              <div className="card-content">
                <h3>{dest.route}</h3>
                <p>From KES {dest.price}</p>
                <button onClick={() => setDestination(dest.route.split(" to ")[1])}>
                  ➡ Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Services Section */}
      <div className="extras-section">
        <h2>🧳 Additional Services</h2>
        <div className="services-grid">
          {services.map((s, idx) => (
            <div key={idx} className="service-card">
              <img src={s.image} alt={s.title} />
              <h4>{s.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookFlight;

