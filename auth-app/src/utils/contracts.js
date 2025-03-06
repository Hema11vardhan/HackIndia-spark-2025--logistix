import Web3 from 'web3';
import { CONTRACT_ADDRESSES, LOGISTICS_REGISTRY_ABI, SHIPMENT_ABI } from '../config/contracts';

// Updated ABIs with the new methods
const AuthABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "isAddressRegistered",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "username",
        "type": "string"
      },
      {
        "internalType": "uint8",
        "name": "role",
        "type": "uint8"
      }
    ],
    "name": "register",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "userAddress",
        "type": "address"
      }
    ],
    "name": "getUserDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "username",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "role",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "registrationTime",
            "type": "uint256"
          }
        ],
        "internalType": "struct Auth.UserDetails",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const ShipmentABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "vehicleType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "registrationNumber",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "capacity",
        "type": "uint256"
      }
    ],
    "name": "addVehicle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const LogisticsRegistryABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "licenseId",
        "type": "string"
      }
    ],
    "name": "registerLogisticsProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "logisticsProviders",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalLogisticsProviders",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "providerAddress",
        "type": "address"
      }
    ],
    "name": "getLogisticsProviderDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "name",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "licenseId",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isVerified",
            "type": "bool"
          },
          {
            "internalType": "uint256",
            "name": "registrationTimestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct LogisticsRegistry.LogisticsProvider",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "providerAddress",
        "type": "address"
      }
    ],
    "name": "verifyLogisticsProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const ShipmentTrackingABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "shipmentId",
        "type": "uint256"
      }
    ],
    "name": "getShipmentLocation",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      },
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract addresses on Sepolia testnet
const addresses = {
  auth: "0x1234567890123456789012345678901234567890", // Replace with your deployed contract address on Sepolia
  shipment: "0x0987654321098765432109876543210987654321", // Replace with your deployed contract address on Sepolia
  logisticsRegistry: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd", // Replace with your deployed contract address on Sepolia
  shipmentTracking: "0xfedcbafedcbafedcbafedcbafedcbafedcbafedcba" // Replace with your deployed contract address on Sepolia
};

// Map contract names to their ABIs
const contractABIs = {
  Auth: AuthABI,
  Shipment: ShipmentABI,
  LogisticsRegistry: LogisticsRegistryABI,
  ShipmentTracking: ShipmentTrackingABI
};

// Get contract instance with better error handling
export const getContractInstance = (web3, contractName) => {
  let address, abi;

  switch (contractName) {
    case 'LogisticsRegistry':
      address = CONTRACT_ADDRESSES.LOGISTICS_REGISTRY;
      abi = LOGISTICS_REGISTRY_ABI;
      break;
    case 'Shipment':
      address = CONTRACT_ADDRESSES.SHIPMENT;
      abi = SHIPMENT_ABI;
      break;
    default:
      throw new Error(`Unknown contract: ${contractName}`);
  }

  if (!address) {
    throw new Error(`Please update the contract address for ${contractName} in contracts.js`);
  }

  return new web3.eth.Contract(abi, address);
};

// Helper function to check if we're on Sepolia testnet
export const isSepoliaNetwork = async (web3) => {
  if (!web3) return false;
  
  try {
    const networkId = await web3.eth.net.getId();
    return networkId === 11155111; // Sepolia testnet ID
  } catch (error) {
    console.error("Error checking network:", error);
    return false;
  }
};

// Helper function to get Sepolia ETH from a faucet
export const getSepoliaEth = () => {
  window.open('https://sepoliafaucet.com/', '_blank');
}; 