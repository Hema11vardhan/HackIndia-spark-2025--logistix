import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Web3Context } from '../contexts/Web3Context';
import './Navbar.css';

const Navbar = () => {
  const { account, isCorrectNetwork, switchToSepolia } = useContext(Web3Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState(0);
  const [isSwitching, setIsSwitching] = useState(false);
  
  useEffect(() => {
    // Check login status whenever location changes
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    setIsLoggedIn(loggedIn);
    
    if (loggedIn) {
      setUsername(localStorage.getItem('username') || 'User');
      setUserRole(parseInt(localStorage.getItem('userRole') || '0'));
    }
  }, [location]);
  
  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('walletAddress');
    
    setIsLoggedIn(false);
    setUsername('');
    setUserRole(0);
    
    toast.info('Logged out successfully');
    navigate('/login');
  };
  

  
  const getDashboardLink = () => {
    switch (userRole) {
      case 1:
        return '/logistics-dashboard';
      case 2:
        return '/developer-dashboard';
      default:
        return '/user-dashboard';
    }
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Logistix
        </Link>
        
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          
          {isLoggedIn ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              <button onClick={handleLogout} className="nav-btn logout">Logout</button>
              
              {username && (
                <div className="user-info">
                  <span className="username">{username}</span>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-btn">Sign Up</Link>
            </>
          )}
          
          {account && (
            <div className="wallet-info">
              <span className="wallet-address">
                {account.substring(0, 6)}...{account.substring(38)}
              </span>
            </div>
          )}
          
         
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 