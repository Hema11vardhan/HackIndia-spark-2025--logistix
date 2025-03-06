// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VehicleSpaceToken is ERC721, Ownable {
    struct SpaceDetails {
        uint256 length;
        uint256 width;
        uint256 height;
        uint256 totalVolume;
        uint256 occupiedVolume;
        uint256 freeVolume;
        uint256 freePercentage;
        string vehicleId;
        bool isActive;
    }

    mapping(uint256 => SpaceDetails) public spaceDetails;
    uint256 private _tokenIds;

    event SpaceTokenized(
        uint256 tokenId,
        string vehicleId,
        uint256 totalVolume,
        uint256 freeVolume
    );

    constructor() ERC721("VehicleSpaceToken", "VST") {}

    function tokenizeSpace(
        string memory vehicleId,
        uint256 length,
        uint256 width,
        uint256 height,
        uint256 occupiedVolume
    ) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        uint256 totalVolume = length * width * height;
        uint256 freeVolume = totalVolume - occupiedVolume;
        uint256 freePercentage = (freeVolume * 100) / totalVolume;

        SpaceDetails memory newSpace = SpaceDetails({
            length: length,
            width: width,
            height: height,
            totalVolume: totalVolume,
            occupiedVolume: occupiedVolume,
            freeVolume: freeVolume,
            freePercentage: freePercentage,
            vehicleId: vehicleId,
            isActive: true
        });

        spaceDetails[newTokenId] = newSpace;
        _mint(msg.sender, newTokenId);

        emit SpaceTokenized(newTokenId, vehicleId, totalVolume, freeVolume);
        return newTokenId;
    }

    function getSpaceDetails(uint256 tokenId) public view returns (SpaceDetails memory) {
        require(_exists(tokenId), "Token does not exist");
        return spaceDetails[tokenId];
    }

    function updateSpaceDetails(
        uint256 tokenId,
        uint256 occupiedVolume
    ) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");

        SpaceDetails storage space = spaceDetails[tokenId];
        space.occupiedVolume = occupiedVolume;
        space.freeVolume = space.totalVolume - occupiedVolume;
        space.freePercentage = (space.freeVolume * 100) / space.totalVolume;
    }
} 