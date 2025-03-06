import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Web3Context } from '../contexts/Web3Context';
import './Login.css';

const Login = () => {
  const { web3, account, connectWallet } = useContext(Web3Context);
  const [loading, setLoading] = useState(false);
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

  const handleLoginClick = async () => {
    try {
      setLoading(true);
      await connectWallet();
      toast.success("Wallet connected successfully");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const authenticateUser = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would verify the user on the blockchain
      // For demo purposes, we'll simulate a successful authentication
      
      // Simulate blockchain verification delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user info in localStorage
      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('username', 'User_' + account.substring(2, 6));
      localStorage.setItem('userRole', '0'); // Default to User role
      localStorage.setItem('walletAddress', account);
      
      toast.success("Login successful!");
      
      // Redirect to dashboard
      redirectToDashboard(0);
    } catch (error) {
      console.error("Authentication error:", error);
      toast.error("Authentication failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Your Account</h2>
        
        <div className="wallet-section">
          {!account ? (
            <>
              <p>Connect your wallet to login</p>
              <button 
                onClick={handleLoginClick} 
                className="connect-wallet-btn"
                disabled={loading}
              >
                {loading ? 'Connecting...' : 'Connect MetaMask'}
              </button>
            </>
          ) : (
            <div className="wallet-connected">
              <p>Wallet connected:</p>
              <p className="wallet-address">
                {account.substring(0, 6)}...{account.substring(38)}
              </p>
              
              {loading ? (
                <p className="authenticating">Authenticating...</p>
              ) : (
                <button onClick={authenticateUser} className="login-btn">
                  Login with this Wallet
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;