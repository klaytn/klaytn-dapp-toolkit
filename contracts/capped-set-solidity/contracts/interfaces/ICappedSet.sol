// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ICappedSet {
    function size() external view returns (uint256);

    function cap() external view returns (uint256);

    function insert(
        address addr,
        uint256 value
    ) external returns (address newLowestAddress, uint256 newLowestValue);

    function update(
        address addr,
        uint256 newVal
    ) external returns (address newLowestAddress, uint256 newLowestValue);

    function remove(
        address addr
    ) external returns (address newLowestAddress, uint256 newLowestValue);

    function getValue(address addr) external returns (uint256);
}
