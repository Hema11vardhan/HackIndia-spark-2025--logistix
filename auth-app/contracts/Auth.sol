// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Auth {
    struct User {
        string email;
        bytes32 passwordHash;
        string userType;
        bool exists;
    }

    mapping(address => User) public users;
    mapping(string => address) private emailToAddress;

    event UserRegistered(address indexed userAddress, string userType);
    event UserLoggedIn(address indexed userAddress, string userType);

    modifier userExists(address _address) {
        require(users[_address].exists, "User does not exist");
        _;
    }

    modifier userDoesNotExist(address _address) {
        require(!users[_address].exists, "User already exists");
        _;
    }

    function signup(
        string memory _email,
        bytes32 _passwordHash,
        string memory _userType
    ) public userDoesNotExist(msg.sender) {
        require(emailToAddress[_email] == address(0), "Email already registered");
        
        users[msg.sender] = User({
            email: _email,
            passwordHash: _passwordHash,
            userType: _userType,
            exists: true
        });
        
        emailToAddress[_email] = msg.sender;
        emit UserRegistered(msg.sender, _userType);
    }

    function login(
        string memory _email,
        bytes32 _passwordHash,
        string memory _userType
    ) public view userExists(msg.sender) returns (bool) {
        User memory user = users[msg.sender];
        
        require(
            keccak256(abi.encodePacked(user.email)) == keccak256(abi.encodePacked(_email)),
            "Invalid credentials"
        );
        require(user.passwordHash == _passwordHash, "Invalid credentials");
        require(
            keccak256(abi.encodePacked(user.userType)) == keccak256(abi.encodePacked(_userType)),
            "Invalid user type"
        );
        
        return true;
    }

    function getUserType(address _address) public view returns (string memory) {
        require(users[_address].exists, "User does not exist");
        return users[_address].userType;
    }
} 