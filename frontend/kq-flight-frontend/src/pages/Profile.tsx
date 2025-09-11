// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import kqcoinAbi from "../abi/KQCoin.json";
import "./Profile.css";

const contractAddress = "0xYourContractAddressHere";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const Profile: React.FC = () => {
  const [account, setAccount] = useState<string>("");
  const [balance, setBalance] = useState<string>("0");
  const [claimCooldown, setClaimCooldown] = useState<number | null>(null);
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [p2pRequests, setP2pRequests] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [p2pAmount, setP2pAmount] = useState("");

  const [provider, setProvider] = useState<ethers.BrowserProvider>();
  const [contract, setContract] = useState<ethers.Contract>();

  /** Initialize provider + contract */
  useEffect(() => {
    if (!window.ethereum) return;
    const prov = new ethers.BrowserProvider(window.ethereum);
    setProvider(prov);
    setContract(new ethers.Contract(contractAddress, kqcoinAbi, prov));
  }, []);

  /** Fetch user profile from backend (MySQL) */
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/1");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  /** Connect MetaMask */
  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask!");
    const [addr] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(addr);
  };

  /** Fetch blockchain balance */
  const fetchBalance = async () => {
    if (!account || !contract) return;
    const bal = await contract.getBalance(account);
    setBalance(ethers.formatEther(bal));
  };

  /** Claim tokens */
  const claimTokens = async () => {
    if (!provider || !contract) return;
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      await contractWithSigner.claimTokens();
      setIsClaimed(true);
      setClaimCooldown(Date.now() + 24 * 60 * 60 * 1000);
    } catch (err) {
      console.error("Claim failed", err);
    }
  };

  /** Send tokens */
  const sendTokens = async () => {
    if (!provider || !contract || !recipient || !amount) return;
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.transferTokens(
        recipient,
        ethers.parseEther(amount)
      );
      await tx.wait();
      fetchBalance();
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  /** Redeem tokens */
  const redeemTokens = async () => {
    if (!provider || !contract) return;
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.redeemTokens();
      await tx.wait();
      fetchBalance();
    } catch (err) {
      console.error("Redeem failed", err);
    }
  };

  /** Submit P2P request */
  const submitP2PRequest = async () => {
    if (!provider || !contract || !p2pAmount) return;
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.requestP2PTrade(
        ethers.parseEther(p2pAmount)
      );
      await tx.wait();
      fetchP2PRequests();
      setP2pAmount("");
    } catch (err) {
      console.error("P2P request failed", err);
    }
  };

  /** Fetch P2P requests */
  const fetchP2PRequests = async () => {
    if (!contract) return;
    try {
      const requests = await contract.getP2PRequests();
      setP2pRequests(requests);
    } catch (err) {
      console.error("Fetch requests failed", err);
    }
  };

  /** Accept P2P request */
  const acceptP2PRequest = async (requestId: number) => {
    if (!provider || !contract) return;
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.acceptP2PRequest(requestId);
      await tx.wait();
      fetchP2PRequests();
    } catch (err) {
      console.error("Accept failed", err);
    }
  };

  // --- Effects ---
  useEffect(() => {
    connectWallet();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (account) {
      fetchBalance();
      fetchP2PRequests();
    }
  }, [account, contract]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (claimCooldown && Date.now() >= claimCooldown) {
        setIsClaimed(false);
        setClaimCooldown(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [claimCooldown]);

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${account}`}
          alt="avatar"
          className="profile-avatar"
        />
        <h2>
          {user
            ? user.name
            : account
            ? account.slice(0, 6) + "..." + account.slice(-4)
            : "Guest"}
        </h2>
        <p className="status">🟢 Online</p>
        <QRCodeCanvas value={account || "guest"} size={100} className="qrcode" />
        <p className="balance">Balance: {balance} KQCoin</p>
      </div>

      {/* Wallet Overview */}
      <div className="wallet-card">
        <h3>Wallet Overview</h3>
        <button className="claim-btn" onClick={claimTokens} disabled={isClaimed}>
          {isClaimed && claimCooldown
            ? `Next claim in ${Math.ceil(
                (claimCooldown - Date.now()) / 1000 / 60
              )} mins`
            : "Claim 20 KQCoin"}
        </button>
        <div className="wallet-actions">
          <input
            type="text"
            placeholder="Recipient Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <button onClick={sendTokens}>Send</button>
          <button onClick={redeemTokens}>Redeem</button>
        </div>
      </div>

      {/* P2P Marketplace */}
      <div className="p2p-card">
        <h3>P2P Marketplace</h3>
        <input
          type="text"
          placeholder="Amount to Request"
          value={p2pAmount}
          onChange={(e) => setP2pAmount(e.target.value)}
        />
        <button onClick={submitP2PRequest}>Submit Request</button>
        <ul>
          {p2pRequests.map((req: any, idx: number) => (
            <li key={idx}>
              {req.sender.slice(0, 6)}...{req.sender.slice(-4)} wants{" "}
              {ethers.formatEther(req.amount)} KQCoin
              <button onClick={() => acceptP2PRequest(req.id)}>Accept</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Profile;

