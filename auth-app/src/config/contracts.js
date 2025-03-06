export const CONTRACT_ADDRESSES = {
  TRUCK_SPACE_TOKEN: "0x9d83e140330758a8fFD07F8Bd73e86ebcA8a5692",
  // Remove or comment out unused contracts
  // LOGISTICS_REGISTRY: "0x...",
  // SHIPMENT: "0x...",
  TEST_TOKEN: "0x1a4eFDA7de72Ef6F9814E7ec2d17DA81c7BA974a",
  LOGISTICS_ADDRESS: "0xFEd74f7AE976C7d6F94978038C24244be8e72b18",
  LOGISTICS_REGISTRY: "0xd9145CCE52D386f254917e481eB44e9943F39138",
  SHIPMENT: "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8",
  DEVELOPER_WALLET: "0xa674d0b7E3eF665e851C18c386094d6556d4A107",
  SPACE_OPTIMIZER: "0xf8e81D47203A594245E36C48e151709F0C19fBe8"
};

export const LOGISTICS_REGISTRY_ABI = [
  // Copy ABI from Remix after compilation
];

export const SHIPMENT_ABI = [
  // Copy ABI from Remix after compilation
];

export const TEST_TOKEN_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
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
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
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
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
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
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const SPACE_OPTIMIZER_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "logisticsProvider",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalVolume",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "freeVolume",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "SpaceOptimizationUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[3]",
        "name": "_truckDimensions",
        "type": "uint256[3]"
      },
      {
        "internalType": "uint256[3]",
        "name": "_freeSpace",
        "type": "uint256[3]"
      },
      {
        "internalType": "uint256",
        "name": "_totalVolume",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_occupiedVolume",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_freeVolume",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_freeSpacePercentage",
        "type": "uint256"
      }
    ],
    "name": "updateSpaceOptimization",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_logisticsProvider",
        "type": "address"
      }
    ],
    "name": "getSpaceOptimization",
    "outputs": [
      {
        "internalType": "uint256[3]",
        "name": "truckDimensions",
        "type": "uint256[3]"
      },
      {
        "internalType": "uint256[3]",
        "name": "freeSpace",
        "type": "uint256[3]"
      },
      {
        "internalType": "uint256",
        "name": "totalVolume",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "occupiedVolume",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "freeVolume",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "freeSpacePercentage",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const NETWORKS = {
  // Assuming you're using Remix VM
  REMIX: {
    chainId: '0x539',
    name: 'Remix VM',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: ''
  }
};

// Optional: Add network configuration for deployment
export const NETWORK_CONFIG = {
  defaultNetwork: 'LOCAL',
  networks: {
    LOCAL: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337
    }
  }
};

// Payment distribution percentages
export const PAYMENT_DISTRIBUTION = {
    LOGISTICS_SHARE: 60,
    DEVELOPER_SHARE: 40
};

// Helper function to calculate payment shares
export const calculatePaymentShares = (amount) => {
    const logisticsShare = (amount * PAYMENT_DISTRIBUTION.LOGISTICS_SHARE) / 100;
    const developerShare = (amount * PAYMENT_DISTRIBUTION.DEVELOPER_SHARE) / 100;
    return {
        logisticsShare,
        developerShare
    };
}; 