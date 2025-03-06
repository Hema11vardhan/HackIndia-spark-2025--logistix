export const VehicleSpaceTokenABI = [
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
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "vehicleId",
        "type": "string"
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
      }
    ],
    "name": "SpaceTokenized",
    "type": "event"
  },
  // ... other ABI entries will be here after compilation
]; 