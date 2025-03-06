// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Shipment {
    struct Vehicle {
        uint256 id;
        string vehicleType;
        string capacity;
        uint256 price;
        bool isAvailable;
    }

    struct ShipmentDetails {
        string source;
        string destination;
        uint256 vehicleId;
        string shipmentType;
        address customer;
        uint256 amount;
        uint256 timestamp;
        bool isActive;
    }

    mapping(uint256 => Vehicle) public vehicles;
    mapping(uint256 => ShipmentDetails) public shipments;
    uint256 public vehicleCount;
    uint256 public shipmentCount;
    address public owner;

    event ShipmentCreated(
        uint256 indexed shipmentId,
        address indexed customer,
        uint256 amount
    );

    constructor() {
        owner = msg.sender;
        // Initialize with some vehicles
        addVehicle("Truck", "1000kg", 5 ether);
        addVehicle("Van", "500kg", 3 ether);
        addVehicle("Mini Truck", "750kg", 4 ether);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function addVehicle(
        string memory vehicleType,
        string memory capacity,
        uint256 price
    ) public onlyOwner {
        vehicleCount++;
        vehicles[vehicleCount] = Vehicle(
            vehicleCount,
            vehicleType,
            capacity,
            price,
            true
        );
    }

    function getAvailableVehicles(string memory source, string memory destination)
        public
        view
        returns (Vehicle[] memory)
    {
        uint256 availableCount = 0;
        for (uint256 i = 1; i <= vehicleCount; i++) {
            if (vehicles[i].isAvailable) {
                availableCount++;
            }
        }

        Vehicle[] memory availableVehicles = new Vehicle[](availableCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 1; i <= vehicleCount; i++) {
            if (vehicles[i].isAvailable) {
                availableVehicles[currentIndex] = vehicles[i];
                currentIndex++;
            }
        }

        return availableVehicles;
    }

    function createShipment(
        string memory source,
        string memory destination,
        uint256 vehicleId,
        string memory shipmentType
    ) public payable {
        require(vehicles[vehicleId].isAvailable, "Vehicle not available");
        require(msg.value == vehicles[vehicleId].price, "Incorrect payment amount");

        shipmentCount++;
        shipments[shipmentCount] = ShipmentDetails(
            source,
            destination,
            vehicleId,
            shipmentType,
            msg.sender,
            msg.value,
            block.timestamp,
            true
        );

        vehicles[vehicleId].isAvailable = false;
        emit ShipmentCreated(shipmentCount, msg.sender, msg.value);
    }

    function completeShipment(uint256 shipmentId) public onlyOwner {
        require(shipments[shipmentId].isActive, "Shipment not active");
        shipments[shipmentId].isActive = false;
        vehicles[shipments[shipmentId].vehicleId].isAvailable = true;
    }

    function getShipmentDetails(uint256 shipmentId)
        public
        view
        returns (ShipmentDetails memory)
    {
        require(shipmentId <= shipmentCount, "Invalid shipment ID");
        return shipments[shipmentId];
    }
} 