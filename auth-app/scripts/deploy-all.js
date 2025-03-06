const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  // Deploy Auth Contract
  const Auth = await hre.ethers.getContractFactory("Auth");
  const auth = await Auth.deploy();
  await auth.deployed();
  console.log("Auth deployed to:", auth.address);

  // Deploy Shipment Contract
  const Shipment = await hre.ethers.getContractFactory("Shipment");
  const shipment = await Shipment.deploy();
  await shipment.deployed();
  console.log("Shipment deployed to:", shipment.address);

  // Deploy LogisticsRegistry Contract
  const LogisticsRegistry = await hre.ethers.getContractFactory("LogisticsRegistry");
  const logisticsRegistry = await LogisticsRegistry.deploy();
  await logisticsRegistry.deployed();
  console.log("LogisticsRegistry deployed to:", logisticsRegistry.address);

  // Deploy ShipmentTracking Contract
  const ShipmentTracking = await hre.ethers.getContractFactory("ShipmentTracking");
  const shipmentTracking = await ShipmentTracking.deploy();
  await shipmentTracking.deployed();
  console.log("ShipmentTracking deployed to:", shipmentTracking.address);

  // Save contract addresses
  const addresses = {
    auth: auth.address,
    shipment: shipment.address,
    logisticsRegistry: logisticsRegistry.address,
    shipmentTracking: shipmentTracking.address
  };

  // Ensure the contracts directory exists
  const contractsDir = path.join(__dirname, "..", "src", "contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save addresses
  fs.writeFileSync(
    path.join(contractsDir, "addresses.json"),
    JSON.stringify(addresses, null, 2)
  );

  console.log("Contract addresses saved to src/contracts/addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 