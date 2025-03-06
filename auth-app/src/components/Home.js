import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Blockchain-Powered Logistics Management</h1>
          <p>Secure, transparent, and efficient supply chain tracking on the Ethereum blockchain</p>
          <div className="hero-buttons">
            <Link to="/signup" className="primary-button">Get Started</Link>
            <Link to="/tracking" className="secondary-button">Track Shipment</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/logistics-illustration.svg" alt="Logistics Illustration" />
        </div>
      </section>

      <section className="features-section">
        <h2>Why Choose Logistix?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Immutable</h3>
            <p>All shipment data is securely stored on the Ethereum blockchain, making it tamper-proof and transparent.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Real-Time Tracking</h3>
            <p>Track your shipments in real-time with precise location updates and status changes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Verified Providers</h3>
            <p>Work with verified logistics providers who meet our quality and reliability standards.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>User-Friendly</h3>
            <p>Easy-to-use interface for all users, whether you're shipping goods or providing logistics services.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create an Account</h3>
            <p>Sign up as a user, logistics provider, or developer and connect your Ethereum wallet.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create or Track Shipments</h3>
            <p>Users can create shipments, while logistics providers manage and update them.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Real-Time Updates</h3>
            <p>Get real-time updates on shipment status and location throughout the delivery process.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Secure Delivery</h3>
            <p>Complete transparency from pickup to delivery with blockchain verification.</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Logistics?</h2>
          <p>Join thousands of users and logistics providers already using Logistix.</p>
          <Link to="/signup" className="primary-button">Get Started Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 