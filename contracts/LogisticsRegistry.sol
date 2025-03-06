// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract LogisticsRegistry {
    struct LogisticsProvider {
        string name;
        string licenseId;
        bool isVerified;
        uint256 registrationTimestamp;
        bool exists;
    }

    mapping(address => LogisticsProvider) public providers;
    address public owner;

    event ProviderRegistered(address provider, string name, string licenseId);
    event ProviderVerified(address provider);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function registerProvider(string memory _name, string memory _licenseId) public {
        require(!providers[msg.sender].exists, "Provider already registered");
        
        providers[msg.sender] = LogisticsProvider({
            name: _name,
            licenseId: _licenseId,
            isVerified: false,
            registrationTimestamp: block.timestamp,
            exists: true
        });

        emit ProviderRegistered(msg.sender, _name, _licenseId);
    }

    function verifyProvider(address _provider) public onlyOwner {
        require(providers[_provider].exists, "Provider does not exist");
        providers[_provider].isVerified = true;
        emit ProviderVerified(_provider);
    }

    function getLogisticsProviderDetails(address provider) public view returns (
        string memory name,
        string memory licenseId,
        bool isVerified,
        uint256 registrationTimestamp
    ) {
        require(providers[provider].exists, "Provider does not exist");
        LogisticsProvider memory p = providers[provider];
        return (p.name, p.licenseId, p.isVerified, p.registrationTimestamp);
    }
} 