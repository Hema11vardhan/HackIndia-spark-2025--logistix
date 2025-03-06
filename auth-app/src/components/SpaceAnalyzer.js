import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Web3Context } from '../contexts/Web3Context';
import TruckSpaceVisualizer from './TruckSpaceVisualizer';
import SpaceInfoPanel from './SpaceInfoPanel';
import TruckDimensionsForm from './TruckDimensionsForm';
import { CONTRACT_ADDRESSES } from '../config/contracts';
import { VehicleSpaceTokenABI } from '../contracts/VehicleSpaceToken';

const SpaceAnalyzer = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const { web3, account } = useContext(Web3Context);
  
  const [dimensions, setDimensions] = useState({
    length: 6.0,
    width: 2.4,
    height: 2.6
  });

  const [freeSpace, setFreeSpace] = useState({
    length: 2.0,
    width: 2.4,
    height: 2.6
  });

  const handleDimensionsChange = (newDimensions) => {
    setDimensions(newDimensions);
    // Update token if it exists
    updateSpaceToken(newDimensions);
  };

  const handleFreeSpaceChange = (newFreeSpace) => {
    setFreeSpace(newFreeSpace);
  };

  const updateSpaceToken = async (newDimensions) => {
    // Implementation for updating space token
  };

  const handleTokenizeSpace = async () => {
    try {
      const occupiedVolume = 
        (dimensions.length * dimensions.width * dimensions.height) -
        (freeSpace.length * freeSpace.width * freeSpace.height);

      await tokenizeVehicleSpace(vehicleId, dimensions, occupiedVolume);
      alert('Space successfully tokenized!');
    } catch (error) {
      console.error('Error tokenizing space:', error);
      alert('Failed to tokenize space');
    }
  };

  return (
    <div className="space-analyzer">
      <div className="header">
        <button onClick={() => navigate(-1)}>Back to Dashboard</button>
        <h2>Space Analyzer - Vehicle #{vehicleId}</h2>
      </div>

      <div className="analyzer-content">
        <div className="forms-section">
          <TruckDimensionsForm
            initialDimensions={dimensions}
            onDimensionsChange={handleDimensionsChange}
            title="Total Truck Dimensions"
          />
          
          <TruckDimensionsForm
            initialDimensions={freeSpace}
            onDimensionsChange={handleFreeSpaceChange}
            title="Free Space Dimensions"
          />
        </div>

        <div className="visualization-section">
          <TruckSpaceVisualizer
            truckDimensions={dimensions}
            freeSpaceDimensions={freeSpace}
          />
        </div>

        <button 
          onClick={handleTokenizeSpace}
          className="tokenize-btn"
        >
          Tokenize Space
        </button>
      </div>
    </div>
  );
};

export default SpaceAnalyzer; 