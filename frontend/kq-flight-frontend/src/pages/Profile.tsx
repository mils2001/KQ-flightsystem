// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import kqcoinAbi from "../abi/KQCoin.json";
import "./Profile.css";

const contractAddress = "0xYourContractAddressHere";

const Profile: React.FC = () => {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [claimCooldown, setClaimCooldown] = useState<number | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [p2pRequests, setP2pRequests] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null); // ✅ MySQL user info

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const contract = new ethers.Contract(contractAddress, kqcoinAbi, provider);

  /** 🔹 Fetch user profile from backend (MySQL) */
  const fetchUserProfile = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user/1"); // adjust endpoint
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
    }
  };

  /** 🔹 Connect Metamask */
  const connectWallet = async () => {
    if (!(window as any).ethereum) return alert("Install MetaMask!");
    const [addr] = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(addr);
  };

  /** 🔹 Fetch blockchain balance */
  const fetchBalance = async () => {
    if (!account) return;
    const bal = await contract.getBalance(account);
    setBalance(ethers.formatEther(bal));
  };

  /** 🔹 Claim tokens */
  const claimTokens = async () => {
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

  /** 🔹 Send tokens */
  const sendTokens = async (recipient: string, amount: string) => {
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.transferTokens(
        recipient,
        ethers.parseEther(amount)
      );
      await tx.wait();
      fetchBalance();
    } catch (err) {
      console.error("Send failed", err);
    }
  };

  /** 🔹 Redeem tokens */
  const redeemTokens = async () => {
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

  /** 🔹 Submit P2P request */
  const submitP2PRequest = async (amount: string) => {
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tx = await contractWithSigner.requestP2PTrade(
        ethers.parseEther(amount)
      );
      await tx.wait();
      fetchP2PRequests();
    } catch (err) {
      console.error("P2P request failed", err);
    }
  };

  /** 🔹 Fetch P2P requests */
  const fetchP2PRequests = async () => {
    try {
      const requests = await contract.getP2PRequests();
      setP2pRequests(requests);
    } catch (err) {
      console.error("Fetch requests failed", err);
    }
  };

  /** 🔹 Accept request */
  const acceptP2PRequest = async (requestId: number) => {
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

  /** �� Hooks */
  useEffect(() => {
    connectWallet();
    fetchUserProfile(); // ✅ load user from MySQL
  }, []);

  useEffect(() => {
    if (account) {
      fetchBalance();
      fetchP2PRequests();
    }
  }, [account]);

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
          {user ? user.name : account ? account.slice(0, 6) + "..." + account.slice(-4) : "Guest"}
        </h2>
        <p className="status">🟢 Online</p>
        <QRCode value={account || "guest"} size={100} className="qrcode" />
        <p className="balance">Balance: {balance} KQCoin</p>
      </div>

      {/* Wallet Overview */}
      <div className="wallet-card">
        <h3>Wallet Overview</h3>
        <button className="claim-btn" onClick={claimTokens} disabled={isClaimed}>
          {isClaimed && claimCooldown
            ? `Next claim in ${Math.ceil((claimCooldown - Date.now()) / 1000 / 60)} mins`
            : "Claim 20 KQCoin"}
        </button>
        <div className="wallet-actions">
          <input type="text" id="recipient" placeholder="Recipient Address" />
          <input type="text" id="amount" placeholder="Amount" />
          <button
            onClick={() => {
              const recipient = (document.getElementById("recipient") as HTMLInputElement).value;
              const amount = (document.getElementById("amount") as HTMLInputElement).value;
              sendTokens(recipient, amount);
            }}
          >
            Send
          </button>
          <button onClick={redeemTokens}>Redeem</button>
        </div>
      </div>

      {/* P2P Marketplace */}
      <div className="p2p-card">
        <h3>P2P Marketplace</h3>
        <input type="text" id="p2pAmount" placeholder="Amount to Request" />
        <button
          onClick={() => {
            const amount = (document.getElementById("p2pAmount") as HTMLInputElement).value;
            submitP2PRequest(amount);
          }}
        >
          Submit Request
        </button>
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

