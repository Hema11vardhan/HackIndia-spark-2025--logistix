// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TruckSpaceToken is ERC1155, Ownable {
    uint256 private _currentTokenId = 0;
    
    struct SpaceDetails {
        uint256 length;
        uint256 width;
        uint256 height;
        uint256 volume;
        bytes32 location;
        bytes32 destination;
        uint256 price;
        bool isAvailable;
        address provider;
        bytes32 truckId;
        uint256 timestamp;
    }

    mapping(uint256 => SpaceDetails) public spaceDetails;
    mapping(address => uint256[]) public providerSpaces;
    mapping(address => uint256[]) public userBookings;

    event SpaceTokenized(
        uint256 indexed tokenId,
        address indexed provider,
        bytes32 truckId,
        uint256 volume
    );

    event SpaceBooked(
        uint256 indexed tokenId,
        address indexed user,
        address indexed provider
    );

    constructor() ERC1155("") Ownable(msg.sender) {
        // Initialize with the deployer as the owner
    }

    function tokenizeSpace(
        uint256 length,
        uint256 width,
        uint256 height,
        bytes32 location,
        bytes32 destination,
        uint256 price,
        bytes32 truckId
    ) public returns (uint256) {
        _currentTokenId += 1;
        uint256 newTokenId = _currentTokenId;
        uint256 volume = length * width * height;

        SpaceDetails memory newSpace = SpaceDetails({
            length: length,
            width: width,
            height: height,
            volume: volume,
            location: location,
            destination: destination,
            price: price,
            isAvailable: true,
            provider: msg.sender,
            truckId: truckId,
            timestamp: block.timestamp
        });

        _mint(msg.sender, newTokenId, 1, "");
        spaceDetails[newTokenId] = newSpace;
        providerSpaces[msg.sender].push(newTokenId);

        emit SpaceTokenized(newTokenId, msg.sender, truckId, volume);
        return newTokenId;
    }

    function bookSpace(uint256 tokenId) public payable {
        require(spaceDetails[tokenId].isAvailable, "Space is not available");
        require(msg.value >= spaceDetails[tokenId].price, "Insufficient payment");

        spaceDetails[tokenId].isAvailable = false;
        userBookings[msg.sender].push(tokenId);

        safeTransferFrom(spaceDetails[tokenId].provider, msg.sender, tokenId, 1, "");
        payable(spaceDetails[tokenId].provider).transfer(msg.value);

        emit SpaceBooked(tokenId, msg.sender, spaceDetails[tokenId].provider);
    }

    function getProviderSpaces(address provider) public view returns (uint256[] memory) {
        return providerSpaces[provider];
    }

    function getUserBookings(address user) public view returns (uint256[] memory) {
        return userBookings[user];
    }

    function getSpaceDetails(uint256 tokenId) public view returns (SpaceDetails memory) {
        return spaceDetails[tokenId];
    }
} 