// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract LogisticsRegistry {
    struct Company {
        string name;
        uint8 status; // 0: Pending, 1: Approved, 2: Rejected
        uint256 applications;
        address walletAddress;
    }

    Company[] public companies;
    address public owner;

    event CompanyStatusChanged(uint256 companyId, uint8 newStatus);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    function addCompany(string memory _name, address _walletAddress) public {
        companies.push(Company(_name, 0, 0, _walletAddress));
    }

    function approveCompany(uint256 _companyId) public onlyOwner {
        require(_companyId < companies.length, "Company does not exist");
        companies[_companyId].status = 1;
        emit CompanyStatusChanged(_companyId, 1);
    }

    function rejectCompany(uint256 _companyId) public onlyOwner {
        require(_companyId < companies.length, "Company does not exist");
        companies[_companyId].status = 2;
        emit CompanyStatusChanged(_companyId, 2);
    }

    function getCompaniesCount() public view returns (uint256) {
        return companies.length;
    }
} 