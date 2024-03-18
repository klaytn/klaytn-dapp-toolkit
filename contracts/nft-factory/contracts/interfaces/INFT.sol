// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface INFT {
    function isMinter(address account) external view returns (bool);

    function initialize(
        string calldata name,
        string calldata symbol,
        string calldata initUri,
        address owner
    ) external;

    function addMinter(address account) external;

    function removeMinter(address account) external;
}
