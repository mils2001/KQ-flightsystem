// src/components/SendKQModal.tsx
import React, { useState } from "react";
import "./ModalStyles.css";

interface SendKQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (recipient: string, amount: number) => void;
}

const SendKQModal: React.FC<SendKQModalProps> = ({ isOpen, onClose, onSend }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = () => {
    if (recipient && amount > 0) {
      onSend(recipient, amount);
      setRecipient("");
      setAmount(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Send KQCoin</h2>
        <input
          type="text"
          placeholder="Recipient Wallet Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Send</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SendKQModal;
