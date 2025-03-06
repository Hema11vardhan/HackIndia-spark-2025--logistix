const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying TruckSpaceToken contract...");

  // Deploy TruckSpaceToken
  const TruckSpaceToken = await ethers.getContractFactory("TruckSpaceToken");
  const truckSpaceToken = await TruckSpaceToken.deploy();
  await truckSpaceToken.deployed();

  console.log("TruckSpaceToken deployed to:", truckSpaceToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });