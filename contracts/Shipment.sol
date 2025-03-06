// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Shipment {
    struct Vehicle {
        string id;
        string vehicleType;
        string registrationNumber;
        uint256 capacity;
        bool available;
    }

    struct ShipmentDetails {
        string source;
        string destination;
        uint8 status; // 0: Created, 1: In Transit, 2: Delivered, 3: Delayed, 4: Cancelled
        uint256 createdAt;
        uint256 estimatedDelivery;
        address provider;
    }

    mapping(address => Vehicle[]) public vehiclesByProvider;
    mapping(string => ShipmentDetails) public shipments;
    mapping(address => string[]) public shipmentsByProvider;

    event VehicleAdded(address provider, string vehicleId);
    event ShipmentCreated(string shipmentId, address provider);
    event ShipmentStatusUpdated(string shipmentId, uint8 status);

    function addVehicle(
        string memory _type,
        string memory _regNumber,
        uint256 _capacity
    ) public {
        string memory vehicleId = string(
            abi.encodePacked(_regNumber, "-", block.timestamp)
        );
        
        vehiclesByProvider[msg.sender].push(Vehicle({
            id: vehicleId,
            vehicleType: _type,
            registrationNumber: _regNumber,
            capacity: _capacity,
            available: true
        }));

        emit VehicleAdded(msg.sender, vehicleId);
    }

    function createShipment(
        string memory _source,
        string memory _destination,
        uint256 _estimatedDelivery
    ) public returns (string memory) {
        string memory shipmentId = string(
            abi.encodePacked(msg.sender, "-", block.timestamp)
        );

        shipments[shipmentId] = ShipmentDetails({
            source: _source,
            destination: _destination,
            status: 0,
            createdAt: block.timestamp,
            estimatedDelivery: _estimatedDelivery,
            provider: msg.sender
        });

        shipmentsByProvider[msg.sender].push(shipmentId);
        emit ShipmentCreated(shipmentId, msg.sender);
        return shipmentId;
    }

    function getVehicleCount(address provider) public view returns (uint256) {
        return vehiclesByProvider[provider].length;
    }

    function getVehicleByIndex(address provider, uint256 index) public view returns (
        string memory id,
        string memory vehicleType,
        string memory registrationNumber,
        uint256 capacity,
        bool available
    ) {
        require(index < vehiclesByProvider[provider].length, "Invalid index");
        Vehicle memory v = vehiclesByProvider[provider][index];
        return (v.id, v.vehicleType, v.registrationNumber, v.capacity, v.available);
    }

    function getShipmentCountByProvider(address provider) public view returns (uint256) {
        return shipmentsByProvider[provider].length;
    }

    function getShipment(string memory shipmentId) public view returns (
        string memory source,
        string memory destination,
        uint8 status,
        uint256 createdAt,
        uint256 estimatedDelivery
    ) {
        ShipmentDetails memory s = shipments[shipmentId];
        return (s.source, s.destination, s.status, s.createdAt, s.estimatedDelivery);
    }

    function updateShipmentStatus(string memory shipmentId, uint8 _status) public {
        require(shipments[shipmentId].provider == msg.sender, "Not authorized");
        require(_status <= 4, "Invalid status");
        shipments[shipmentId].status = _status;
        emit ShipmentStatusUpdated(shipmentId, _status);
    }
} 