import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Web3Provider } from './contexts/Web3Context';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import UserDashboard from './components/UserDashboard';
import LogisticsDashboard from './components/LogisticsDashboard';
import DeveloperDashboard from './components/DeveloperDashboard';
import TruckSpaceAnalyzer from './components/TruckSpaceAnalyzer';
import TokenizedSpaceDashboard from './components/TokenizedSpaceDashboard';
import { LogisticsProvider } from './context/LogisticsContext';
import './App.css';

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const userRole = parseInt(localStorage.getItem('userRole') || '0');
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole !== undefined && userRole !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    switch (userRole) {
      case 0:
        return <Navigate to="/user-dashboard" />;
      case 1:
        return <Navigate to="/logistics-dashboard" />;
      case 2:
        return <Navigate to="/developer-dashboard" />;
      default:
        return <Navigate to="/login" />;
    }
  }
  
  return children;
};

const AppContent = () => {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute requiredRole={0}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/logistics-dashboard" 
          element={
            <ProtectedRoute requiredRole={1}>
              <LogisticsDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/developer-dashboard" 
          element={
            <ProtectedRoute requiredRole={2}>
              <DeveloperDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/truck-space-analyzer" 
          element={
            <ProtectedRoute requiredRole={1}>
              <TruckSpaceAnalyzer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tokenized-spaces" 
          element={
            <ProtectedRoute>
              <TokenizedSpaceDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

function App() {
  return (
    <LogisticsProvider>
      <Web3Provider>
        <Router>
          <AppContent />
        </Router>
      </Web3Provider>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </LogisticsProvider>
  );
}

export default App;