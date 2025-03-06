// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ShipmentTracking {
    struct Location {
        uint256 latitude;
        uint256 longitude;
        uint256 timestamp;
    }

    struct Shipment {
        string id;
        address courier;
        Location currentLocation;
        bool isActive;
    }

    mapping(string => Shipment) public shipments;
    address public owner;

    event LocationUpdated(
        string indexed shipmentId,
        uint256 latitude,
        uint256 longitude,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorized(string memory shipmentId) {
        require(
            msg.sender == owner || msg.sender == shipments[shipmentId].courier,
            "Not authorized"
        );
        _;
    }

    function createShipment(string memory shipmentId, address courier) public onlyOwner {
        require(!shipments[shipmentId].isActive, "Shipment already exists");
        
        shipments[shipmentId] = Shipment({
            id: shipmentId,
            courier: courier,
            currentLocation: Location({
                latitude: 0,
                longitude: 0,
                timestamp: 0
            }),
            isActive: true
        });
    }

    function updateLocation(
        string memory shipmentId,
        uint256 latitude,
        uint256 longitude
    ) public onlyAuthorized(shipmentId) {
        require(shipments[shipmentId].isActive, "Shipment not active");

        Location memory newLocation = Location({
            latitude: latitude,
            longitude: longitude,
            timestamp: block.timestamp
        });

        shipments[shipmentId].currentLocation = newLocation;

        emit LocationUpdated(
            shipmentId,
            latitude,
            longitude,
            block.timestamp
        );
    }

    function getShipmentLocation(string memory shipmentId) 
        public 
        view 
        returns (uint256 latitude, uint256 longitude, uint256 timestamp) 
    {
        require(shipments[shipmentId].isActive, "Shipment not found");
        Location memory loc = shipments[shipmentId].currentLocation;
        return (loc.latitude, loc.longitude, loc.timestamp);
    }

    function deactivateShipment(string memory shipmentId) public onlyOwner {
        require(shipments[shipmentId].isActive, "Shipment not active");
        shipments[shipmentId].isActive = false;
    }
} 