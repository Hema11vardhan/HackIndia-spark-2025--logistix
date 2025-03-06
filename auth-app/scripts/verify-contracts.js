const hre = require("hardhat");
const path = require('path');
const fs = require('fs');

async function main() {
  console.log("Current working directory:", process.cwd());
  
  // Update path to match your folder structure
  const addressesPath = path.join(process.cwd(), 'src', 'contracts', 'contracts', 'addresses.json');
  
  console.log("\nTrying path:", addressesPath);
  console.log("Path exists?", fs.existsSync(addressesPath));

  // List contents of directories
  console.log("\nDirectory contents:");
  try {
    console.log("src/contracts/:", fs.readdirSync(path.join(process.cwd(), 'src', 'contracts')));
    console.log("src/contracts/contracts/:", fs.readdirSync(path.join(process.cwd(), 'src', 'contracts', 'contracts')));
  } catch (error) {
    console.error("Error reading directories:", error);
  }

  // Create addresses.json if it doesn't exist
  if (!fs.existsSync(addressesPath)) {
    console.log("\nCreating addresses.json...");
    const addresses = {
      "auth": "0xcB68904715b76B5B670f178788E031E11109518A",
      "shipment": "0xEa88262088AE8f9629cf3ce4fa780C17121eCF5b",
      "logisticsRegistry": "0x2cFbaBECdfc9610eCaB889Eb31dDb4C19f586593",
      "shipmentTracking": "0x4aa968A1AF2a08302adC717445302045771b552a"
    };
    fs.writeFileSync(addressesPath, JSON.stringify(addresses, null, 2));
    console.log("Created addresses.json");
  }

  const addresses = JSON.parse(fs.readFileSync(addressesPath));
  console.log("\nFound contract addresses:", addresses);

  try {
    console.log("\nVerifying Auth contract at:", addresses.auth);
    await hre.run("verify:verify", {
      address: addresses.auth,
      constructorArguments: [],
    });
    console.log("Auth contract verified successfully");
  } catch (error) {
    console.log("Error verifying Auth:", error.message);
  }

  try {
    console.log("\nVerifying Shipment contract at:", addresses.shipment);
    await hre.run("verify:verify", {
      address: addresses.shipment,
      constructorArguments: [],
    });
    console.log("Shipment contract verified successfully");
  } catch (error) {
    console.log("Error verifying Shipment:", error.message);
  }

  try {
    console.log("\nVerifying LogisticsRegistry contract at:", addresses.logisticsRegistry);
    await hre.run("verify:verify", {
      address: addresses.logisticsRegistry,
      constructorArguments: [],
    });
    console.log("LogisticsRegistry contract verified successfully");
  } catch (error) {
    console.log("Error verifying LogisticsRegistry:", error.message);
  }

  try {
    console.log("\nVerifying ShipmentTracking contract at:", addresses.shipmentTracking);
    await hre.run("verify:verify", {
      address: addresses.shipmentTracking,
      constructorArguments: [],
    });
    console.log("ShipmentTracking contract verified successfully");
  } catch (error) {
    console.log("Error verifying ShipmentTracking:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error in main:", error);
    process.exit(1);
  });