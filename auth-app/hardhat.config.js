require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// Ensure you have these environment variables
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!SEPOLIA_RPC_URL || !PRIVATE_KEY) {
  console.error("Please set your SEPOLIA_RPC_URL and PRIVATE_KEY in a .env file");
  process.exit(1);
}

module.exports = {
  solidity: "0.8.20",
  networks: {
    // For local development
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    // For Sepolia testnet
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: 11155111
    },
    // For Goerli testnet
    goerli: {
      url: process.env.GOERLI_RPC_URL || "https://goerli.infura.io/v3/YOUR-PROJECT-ID",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 5
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./src/artifacts"
  }
};