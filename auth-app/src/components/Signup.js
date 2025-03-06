// Signup.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Web3Context } from '../contexts/Web3Context';
import './Signup.css';

const Signup = () => {
  const { web3, account, connectWallet } = useContext(Web3Context);
  const [formData, setFormData] = useState({
    username: '',
    role: '0' // Default to User role
  });
  const [loading, setLoading] = useState(false);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (loggedIn) {
      const userRole = localStorage.getItem('userRole') || '0';
      redirectToDashboard(userRole);
    }
  }, []);

  const redirectToDashboard = (role) => {
    console.log("Redirecting to dashboard for role:", role);
    switch (parseInt(role)) {
      case 0: // User
        navigate('/user-dashboard');
        break;
      case 1: // Logistics Provider
        navigate('/logistics-dashboard');
        break;
      case 2: // Developer
        navigate('/developer-dashboard');
        break;
      default:
        navigate('/user-dashboard');
    }
  };

  const handleConnectWallet = async () => {
    try {
      setWalletConnecting(true);
      await connectWallet();
      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet: " + (error.message || "Unknown error"));
    } finally {
      setWalletConnecting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!account) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!formData.username.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    try {
      setLoading(true);
      
      // In a real app, you would register the user on the blockchain
      // For demo purposes, we'll simulate a successful registration
      
      // Simulate blockchain transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store user info in localStorage
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', formData.username);
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('walletAddress', account);
      
      toast.success("Account created successfully!");
      
      // Redirect to dashboard
      redirectToDashboard(parseInt(formData.role));
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Create an Account</h2>
        
        {!account ? (
          <div className="wallet-section">
            <p>Connect your wallet to sign up</p>
            <button 
              onClick={handleConnectWallet} 
              className="connect-wallet-btn"
              disabled={walletConnecting}
            >
              {walletConnecting ? 'Connecting...' : 'Connect MetaMask'}
            </button>
          </div>
        ) : (
          <>
            <div className="wallet-connected">
              <p>Wallet connected:</p>
              <p className="wallet-address">
                {account.substring(0, 6)}...{account.substring(38)}
              </p>
            </div>
            
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                />
              </div>
              
              <div className="form-group">
                <label>Account Type</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="0">User</option>
                  <option value="1">Logistics Provider</option>
                  <option value="2">Developer</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="signup-btn"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>
          </>
        )}
        
        <div className="signup-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Signup;