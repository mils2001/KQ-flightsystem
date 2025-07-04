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

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/flights")
      .then((res) => setFlights(res.data.flights))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % imageSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBooking = async () => {
    if (!origin || !destination || !departureDate || !passengerName || seats < 1) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      const res = await axios.post(
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
      setError("Booking failed. Please try again.");
    }
  };

  return (
    <div className="booking-page">
      {/* Slideshow */}
      <div className="slideshow">
        <img src={imageSlides[currentSlide]} alt="slideshow" />
        <div className="marketing-text">
          <h1>Fly with Confidence</h1>
          <p>Book flights at the best rates with Kenya Airways</p>
        </div>
      </div>

      {/* Booking Form */}
      <div className="booking-section">
        <h2>Book Your Flight</h2>
        <p className="user-balance">Wallet Balance: ${userBalance}</p>
        <div className="form-grid">
          <input type="text" placeholder="Origin" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          <input type="text" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} />
          <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
            <option value="oneway">One Way</option>
            <option value="roundtrip">Round Trip</option>
          </select>
          <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} />
          {tripType === "roundtrip" && (
            <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
          )}
          <input type="text" placeholder="Passenger Name" value={passengerName} onChange={(e) => setPassengerName(e.target.value)} />
          <input type="number" min="1" placeholder="Seats" value={seats} onChange={(e) => setSeats(Number(e.target.value))} />
          <button onClick={handleBooking}>Confirm Booking</button>
        </div>
        {error && <p className="error">{error}</p>}
        {bookingSuccess && <p className="success">Booking confirmed successfully!</p>}
      </div>

      {/* Destination Cards */}
      <div className="destination-section">
        <h2>Popular Destinations</h2>
        <div className="destination-grid">
          {flights.map((flight, index) => (
            <div key={index} className="destination-card">
              <img src={imageSlides[index % imageSlides.length]} alt={flight.destination} />
              <div className="card-content">
                <h3>{flight.destination}</h3>
                <p>{flight.origin} → {flight.destination}</p>
                <p>Price: ${flight.price}</p>
                <button onClick={() => setDestination(flight.destination)}>Book Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookFlight;

