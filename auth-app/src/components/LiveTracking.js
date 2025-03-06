import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Web3Context } from '../contexts/Web3Context';
import { getContractInstance } from '../utils/contracts';
import './LiveTracking.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
};

const center = {
  lat: 20.5937, // Default center (India)
  lng: 78.9629,
};

const LiveTracking = () => {
  const { web3, account } = useContext(Web3Context);
  const [shipmentId, setShipmentId] = useState('');
  const [shipmentData, setShipmentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackShipment = async (e) => {
    e.preventDefault();
    
    if (!shipmentId) {
      setError('Please enter a shipment ID');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const trackingContract = getContractInstance(web3, 'ShipmentTracking');
      const shipmentContract = getContractInstance(web3, 'Shipment');
      
      // Get shipment details
      const shipment = await shipmentContract.methods.getShipment(shipmentId).call();
      
      // Get current location
      const [lat, lng, timestamp] = await trackingContract.methods.getShipmentLocation(shipmentId).call();
      
      setShipmentData({
        id: shipmentId,
        source: shipment.source,
        destination: shipment.destination,
        status: getStatusText(shipment.status),
        currentLocation: {
          lat: parseFloat(lat) / 1000000,
          lng: parseFloat(lng) / 1000000
        },
        lastUpdated: new Date(timestamp * 1000).toLocaleString(),
        estimatedDelivery: new Date(shipment.estimatedDeliveryTime * 1000).toLocaleDateString()
      });
      
    } catch (error) {
      console.error("Error tracking shipment:", error);
      setError('Failed to track shipment. It may not exist or you may not have permission to view it.');
      setShipmentData(null);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusText = (statusCode) => {
    const statuses = ['Created', 'In Transit', 'Delivered', 'Delayed', 'Cancelled'];
    return statuses[statusCode] || 'Unknown';
  };

  return (
    <div className="live-tracking-container">
      <div className="tracking-header">
        <h2>Live Shipment Tracking</h2>
        <p>Track your shipment in real-time</p>
      </div>
      
      <div className="tracking-form">
        <form onSubmit={handleTrackShipment}>
          <div className="form-group">
            <label>Shipment ID</label>
            <input
              type="text"
              value={shipmentId}
              onChange={(e) => setShipmentId(e.target.value)}
              placeholder="Enter shipment ID"
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Tracking...' : 'Track Shipment'}
          </button>
        </form>
        
        {error && <div className="error-message">{error}</div>}
      </div>
      
      {shipmentData && (
        <div className="shipment-details">
          <h3>Shipment #{shipmentData.id}</h3>
          
          <div className="shipment-info">
            <div className="info-item">
              <span className="label">Status:</span>
              <span className={`status-badge ${shipmentData.status.toLowerCase()}`}>
                {shipmentData.status}
              </span>
            </div>
            <div className="info-item">
              <span className="label">From:</span>
              <span>{shipmentData.source}</span>
            </div>
            <div className="info-item">
              <span className="label">To:</span>
              <span>{shipmentData.destination}</span>
            </div>
            <div className="info-item">
              <span className="label">Last Updated:</span>
              <span>{shipmentData.lastUpdated}</span>
            </div>
            <div className="info-item">
              <span className="label">Estimated Delivery:</span>
              <span>{shipmentData.estimatedDelivery}</span>
            </div>
          </div>
          
          <div className="map-container">
            <div className="map-placeholder">
              <p>Map showing location at coordinates: {shipmentData.currentLocation.lat}, {shipmentData.currentLocation.lng}</p>
              <p>Note: Actual map integration would be implemented here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;