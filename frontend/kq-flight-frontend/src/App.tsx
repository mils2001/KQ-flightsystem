// src/App.tsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import SearchFlights from "./pages/SearchFlights";
import BookFlight from "./pages/BookFlight";
import Profile from "./pages/Profile";
import Login from "./pages/Login";

import AOS from "aos";
import "aos/dist/aos.css";

const App: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  return (
    <>
      {/* ✅ Navbar added so it shows on all pages */}
      <Navbar />

      {/* ✅ Routes for pages */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchFlights />} />
        <Route path="/book" element={<BookFlight />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

export default App;

