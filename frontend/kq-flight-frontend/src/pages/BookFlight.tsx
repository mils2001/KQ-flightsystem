import React, { useEffect, useState } from "react";
import "./BookFlight.css";

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
  const [userBalance, setUserBalance] = useState(1000); // Simulated balance

  useEffect(() => {
    fetch("http://localhost:5000/api/flights", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setFlights(data.flights || []))
      .catch((err) => console.error("❌ Flights fetch failed", err));
  }, []);

  const handleBooking = async (flight: any) => {
    if (!passengerName || !departureDate) {
      setError("Please fill in passenger name and departure date.");
      return;
    }

    const totalCost = flight.price * seats;
    if (userBalance < totalCost) {
      setError("Insufficient balance to book this flight.");
      return;
    }

    const bookingData = {
      flight_number: flight.flight_number,
      passenger_name: passengerName,
      seats_booked: seats,
      seat_number: "A1",
      departure_date: departureDate,
    };

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) throw new Error("Booking failed");
      setUserBalance(userBalance - totalCost);
      setBookingSuccess(true);
      setError("");
    } catch (err) {
      console.error("Booking error:", err);
      setError("Booking failed. Try again.");
    }
  };

  const filteredFlights = flights.filter(
    (f) =>
      f.origin.toLowerCase().includes(origin.toLowerCase()) &&
      f.destination.toLowerCase().includes(destination.toLowerCase())
  );

  return (
    <div className="book-flight-container spaced-layout">
      <h1 className="title">✈️ Fly with Kenya Airways</h1>

      <div className="marketing-banner">
        <img src="https://i.imgur.com/jM4UrOZ.jpeg" alt="Sky" />
        <div className="overlay-text">
          <h2>Comfort. Safety. Reliability.</h2>
          <p>Book now and experience world-class service</p>
        </div>
      </div>

      <div className="instructions-card">
        <h3>📋 Booking Instructions</h3>
        <ol>
          <li>Select Origin and Destination</li>
          <li>Choose One-way or Return</li>
          <li>Select Departure Date (and Return if needed)</li>
          <li>Enter Passenger Name and Seats</li>
          <li>Click “Book Now” to confirm</li>
          <li>You’ll receive SMS confirmation once successful</li>
        </ol>
      </div>

      <div className="balance-display">
        Current Wallet Balance: <strong>${userBalance.toFixed(2)}</strong>
      </div>

      <div className="booking-form">
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
        <div className="trip-options">
          <label>
            <input
              type="radio"
              value="oneway"
              checked={tripType === "oneway"}
              onChange={() => setTripType("oneway")}
            />
            One-way
          </label>
          <label>
            <input
              type="radio"
              value="return"
              checked={tripType === "return"}
              onChange={() => setTripType("return")}
            />
            Return
          </label>
        </div>

        <label>Departure Date:</label>
        <input
          type="date"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />

        {tripType === "return" && (
          <>
            <label>Return Date:</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </>
        )}

        <input
          type="text"
          placeholder="Passenger Name"
          value={passengerName}
          onChange={(e) => setPassengerName(e.target.value)}
        />
        <input
          type="number"
          min={1}
          placeholder="Number of Seats"
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
        />
      </div>

      {error && <p className="error-message">⚠️ {error}</p>}

      <h2 className="section-title">🛫 Explore Destinations</h2>
      <div className="flight-cards">
        {filteredFlights.length === 0 ? (
          <p>No flights available for selected route.</p>
        ) : (
          filteredFlights.map((flight, index) => (
            <div key={index} className="flight-card">
              <img
                src={flight.image_url || "https://i.imgur.com/w7nieOM.jpeg"}
                alt="Flight"
                className="flight-image"
              />
              <h3>{flight.destination}</h3>
              <p>From: {flight.origin}</p>
              <p>Flight #: {flight.flight_number}</p>
              <p>Class: {flight.flight_class}</p>
              <p>Price: ${flight.price}</p>
              <button
                className="book-button"
                onClick={() => handleBooking(flight)}
              >
                Book Now
              </button>
            </div>
          ))
        )}
      </div>

      {bookingSuccess && (
        <div className="success-modal">
          <div className="modal-content">
            <h2>✅ Booking Successful!</h2>
            <p>Your flight has been reserved. SMS confirmation is on its way.</p>
            <button onClick={() => setBookingSuccess(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFlight;

