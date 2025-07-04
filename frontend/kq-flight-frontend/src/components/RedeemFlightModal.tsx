// src/components/RedeemFlightModal.tsx
import React from "react";
import "./ModalStyles.css";

interface Route {
  id: number;
  origin: string;
  destination: string;
  price: number; // in KQCoin
}

interface RedeemFlightModalProps {
  isOpen: boolean;
  onClose: () => void;
  routes: Route[];
  onRedeem: (routeId: number) => void;
}

const RedeemFlightModal: React.FC<RedeemFlightModalProps> = ({ isOpen, onClose, routes, onRedeem }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Redeem Flights</h2>
        {routes.map((route) => (
          <div key={route.id} className="route-card">
            <p>{route.origin} ➡️ {route.destination}</p>
            <p>Price: {route.price} KQCoin</p>
            <button onClick={() => onRedeem(route.id)}>Book Now</button>
          </div>
        ))}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default RedeemFlightModal;
