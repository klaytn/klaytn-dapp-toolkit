    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./contribute.sol";

contract ContributionSystemFactory {
    struct SystemInfo {
        address systemAddress;
        address creator;
    }

    mapping(address => SystemInfo[]) public systemsByCreator;
    address[] public deployedSystems;

    event ContributionSystemCreated(address indexed newSystem, address indexed creator);

    function createContributionSystem(uint _dayRange, uint _expectedNumber, uint _contributionAmount, address _tokenAddress) external {
        ContributionSystem newSystem = new ContributionSystem(_dayRange, _expectedNumber, _contributionAmount, _tokenAddress);
        deployedSystems.push(address(newSystem));
        emit ContributionSystemCreated(address(newSystem), msg.sender);

        SystemInfo memory info;
        info.systemAddress = address(newSystem);
        info.creator = msg.sender;
        systemsByCreator[msg.sender].push(info);
    }

    function getDeployedSystems() external view returns (address[] memory) {
        return deployedSystems;
    }

    function getSystemsByCreator(address _creator) external view returns (SystemInfo[] memory) {
        return systemsByCreator[_creator];
    }
}
