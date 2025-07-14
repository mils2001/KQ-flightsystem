// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './Profile.css';
import QRCode from 'qrcode.react';
import kqcoinAbi from '../abi/KQCoin.json';

const contractAddress = '0xYourContractAddressHere'; // Replace with your real contract address

const Profile = () => {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [claimCooldown, setClaimCooldown] = useState<number | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [p2pRequests, setP2pRequests] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  const provider = new ethers.BrowserProvider((window as any).ethereum);
  const contract = new ethers.Contract(contractAddress, kqcoinAbi, provider);

  const connectWallet = async () => {
    if (!(window as any).ethereum) return alert('Install MetaMask!');
    const [addr] = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(addr);
  };

  const fetchBalance = async () => {
    if (!account) return;
    const bal = await contract.getBalance(account);
    setBalance(ethers.formatEther(bal));
  };

  const claimTokens = async () => {
    try {
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      await contractWithSigner.claimTokens();
      setIsClaimed(true);
      setClaimCooldown(Date.now() + 24 * 60 * 60 * 1000);
    } catch (err) {
      console.error('Claim failed', err);
    }
  };

  const sendTokens = async (recipient: string, amount: string) => {
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.transferTokens(recipient, ethers.parseEther(amount));
    await tx.wait();
    fetchBalance();
  };

  const redeemTokens = async () => {
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.redeemTokens();
    await tx.wait();
    fetchBalance();
  };

  const submitP2PRequest = async (amount: string) => {
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.requestP2PTrade(ethers.parseEther(amount));
    await tx.wait();
  };

  const fetchP2PRequests = async () => {
    const requests = await contract.getP2PRequests();
    setP2pRequests(requests);
  };

  const acceptP2PRequest = async (requestId: number) => {
    const signer = await provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const tx = await contractWithSigner.acceptP2PRequest(requestId);
    await tx.wait();
    fetchP2PRequests();
  };

  useEffect(() => {
    connectWallet();
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
    <div className="profile-page">
      <div className="atm-card">
        <div className="card-header">
          <h2>KQCoin Wallet</h2>
        </div>
        <div className="card-body">
          <p><strong>User:</strong> {account.slice(0, 6)}...{account.slice(-4)} ✅</p>
          <p><strong>Balance:</strong> {balance} KQCoin</p>
          <QRCode value={account} size={80} />
        </div>
      </div>

      <div className="wallet-overview">
        <h3>Wallet Overview</h3>
        <p><strong>Claim Rewards:</strong></p>
        <button className="claim-button" onClick={claimTokens} disabled={isClaimed}>
          {isClaimed ? `Next claim in ${Math.ceil((claimCooldown! - Date.now()) / 3600000)}h` : 'Claim 2 KQCoin'}
        </button>

        <div className="actions">
          <input type="text" id="recipient" placeholder="Recipient Address" />
          <input type="text" id="amount" placeholder="Amount" />
          <button onClick={() => {
            const recipient = (document.getElementById('recipient') as HTMLInputElement).value;
            const amount = (document.getElementById('amount') as HTMLInputElement).value;
            sendTokens(recipient, amount);
          }}>
            Send KQCoin
          </button>

          <button onClick={redeemTokens}>Redeem for Tickets</button>
        </div>

        <div className="p2p-section">
          <h3>P2P Marketplace</h3>
          <input type="text" id="p2pAmount" placeholder="Amount to Request" />
          <button onClick={() => {
            const amount = (document.getElementById('p2pAmount') as HTMLInputElement).value;
            submitP2PRequest(amount);
          }}>
            Submit P2P Request
          </button>

          <h4>Available Requests</h4>
          <ul>
            {p2pRequests.map((req, idx) => (
              <li key={idx}>
                {req.sender.slice(0, 6)}...{req.sender.slice(-4)} wants {ethers.formatEther(req.amount)} KQCoin
                <button onClick={() => acceptP2PRequest(req.id)}>Accept</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;

