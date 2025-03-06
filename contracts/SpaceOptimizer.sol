// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SpaceOptimizer {
    struct TruckDimensions {
        uint256 length;
        uint256 width;
        uint256 height;
    }

    struct SpaceData {
        TruckDimensions truckDimensions;
        TruckDimensions freeSpace;
        uint256 totalVolume;
        uint256 occupiedVolume;
        uint256 freeVolume;
        uint256 freeSpacePercentage;
        uint256 timestamp;
    }

    mapping(address => SpaceData) public spaceOptimizations;
    address[] public logisticsProviders;

    event SpaceOptimizationUpdated(
        address indexed logisticsProvider,
        uint256 totalVolume,
        uint256 freeVolume,
        uint256 timestamp
    );

    function updateSpaceOptimization(
        uint256[3] memory _truckDimensions,
        uint256[3] memory _freeSpace,
        uint256 _totalVolume,
        uint256 _occupiedVolume,
        uint256 _freeVolume,
        uint256 _freeSpacePercentage
    ) public {
        SpaceData storage data = spaceOptimizations[msg.sender];
        
        data.truckDimensions = TruckDimensions({
            length: _truckDimensions[0],
            width: _truckDimensions[1],
            height: _truckDimensions[2]
        });
        
        data.freeSpace = TruckDimensions({
            length: _freeSpace[0],
            width: _freeSpace[1],
            height: _freeSpace[2]
        });

        data.totalVolume = _totalVolume;
        data.occupiedVolume = _occupiedVolume;
        data.freeVolume = _freeVolume;
        data.freeSpacePercentage = _freeSpacePercentage;
        data.timestamp = block.timestamp;

        if (spaceOptimizations[msg.sender].timestamp == 0) {
            logisticsProviders.push(msg.sender);
        }

        emit SpaceOptimizationUpdated(
            msg.sender,
            _totalVolume,
            _freeVolume,
            block.timestamp
        );
    }

    function getSpaceOptimization(address _logisticsProvider) 
        public 
        view 
        returns (
            uint256[3] memory truckDimensions,
            uint256[3] memory freeSpace,
            uint256 totalVolume,
            uint256 occupiedVolume,
            uint256 freeVolume,
            uint256 freeSpacePercentage,
            uint256 timestamp
        ) 
    {
        SpaceData storage data = spaceOptimizations[_logisticsProvider];
        
        truckDimensions = [
            data.truckDimensions.length,
            data.truckDimensions.width,
            data.truckDimensions.height
        ];
        
        freeSpace = [
            data.freeSpace.length,
            data.freeSpace.width,
            data.freeSpace.height
        ];

        return (
            truckDimensions,
            freeSpace,
            data.totalVolume,
            data.occupiedVolume,
            data.freeVolume,
            data.freeSpacePercentage,
            data.timestamp
        );
    }
} 