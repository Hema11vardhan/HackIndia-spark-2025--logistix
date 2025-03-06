import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Web3Context } from '../contexts/Web3Context';
import './NetworkWarning.css';

const NetworkWarning = () => {
  const { isCorrectNetwork, switchToSepolia, getTestEth } = useContext(Web3Context);
  const [isSwitching, setIsSwitching] = useState(false);

  if (isCorrectNetwork) {
    return null;
  }

 

  return (
    <div className="network-warning">
    
      <div className="warning-actions">
        <button 
          onClick={handleSwitchNetwork} 
          className="switch-network-btn"
          disabled={isSwitching}
        >
          {isSwitching ? 'Switching...' : 'Switch to Sepolia'}
        </button>
        <button onClick={handleGetTestEth} className="get-eth-btn">
          Get Test ETH
        </button>
      </div>
    </div>
  );
};

export default NetworkWarning; 