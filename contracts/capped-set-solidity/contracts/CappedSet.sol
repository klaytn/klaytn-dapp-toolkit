// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./interfaces/ICappedSet.sol";

error EInvalidCap();
error EInvalidAddress();
error EAddressNotExist();
error EAddressExist();

/**
 * @title CappedSet
 * @author danielNg
 */
contract CappedSet is ICappedSet {
    // mapping from key to value
    mapping(address => uint256) _values;
    // doubly linked list for maintaining a sorted list
    // it's more gas efficient when the size is > 10 than using an array and querying for the index for every operation
    // read from untouched slot cost 2100 gas (https://github.com/wolflo/evm-opcodes/blob/main/gas.md#a6-sload)
    // store to a slot cost mostly 20000 gas (https://github.com/wolflo/evm-opcodes/blob/main/gas.md#a6-sload)
    mapping(address => address) _nextAddresses;
    mapping(address => address) _prevAddresses;
    uint256 public size;
    uint256 public immutable cap;
    address constant GUARD = address(1);

    /**
     * @notice check if address is valid
     * @param addr address to check
     */
    modifier validAddress(address addr) {
        if (addr == address(0)) {
            revert EInvalidAddress();
        }
        _;
    }

    /**
     * @notice check if address has been inserted before
     * @param addr address to check
     */
    modifier addressExist(address addr) {
        if (_nextAddresses[addr] == address(0)) {
            revert EAddressNotExist();
        }
        _;
    }

    /**
     * @notice check if address hasn't been inserted before
     * @param addr address to check
     */
    modifier addressNotExist(address addr) {
        if (_nextAddresses[addr] != address(0)) {
            revert EAddressExist();
        }
        _;
    }

    /**
     *
     * @param _cap capactiy of the set
     * Requirements: cap greater than 0
     */
    constructor(uint256 _cap) {
        if (_cap == 0) {
            revert EInvalidCap();
        }
        cap = _cap;
        _nextAddresses[GUARD] = GUARD;
        _prevAddresses[GUARD] = GUARD;
    }

    /**
     * @notice get the value of an address
     * @param addr address to get
     * Revert if address doesn't exist
     */
    function getValue(
        address addr
    ) external view addressExist(addr) returns (uint256) {
        return _values[addr];
    }

    /**
     * @notice insert an address with a value
     * @param addr address to insert
     * @param value value to insert
     * Revert if address is invalid or already exists
     * If cap is reached, boot out the lowest element with lowest value
     * Returns the new lowest address and value
     */
    function insert(
        address addr,
        uint256 value
    )
        external
        validAddress(addr)
        addressNotExist(addr)
        returns (address newLowestAddress, uint256 newLowestValue)
    {
        if (cap == size) {
            _remove(_nextAddresses[GUARD]);
        } else {
            unchecked {
                ++size;
            }
        }

        _insert(addr, value);

        if (size > 1) {
            newLowestAddress = _nextAddresses[GUARD];
            newLowestValue = _values[newLowestAddress];
        }
    }

    /**
     * @notice update an address with a new value
     * @param addr address to update
     * @param newVal new value to update
     * Revert if address doesn't exist
     * Returns the new lowest address and value
     */
    function update(
        address addr,
        uint256 newVal
    )
        external
        addressExist(addr)
        returns (address newLowestAddress, uint256 newLowestValue)
    {
        (address _prev, address _next) = (
            _prevAddresses[addr],
            _nextAddresses[addr]
        );

        if (_values[_prev] <= newVal && _values[_next] >= newVal) {
            _values[addr] = newVal;
        } else {
            _remove(addr);
            _insert(addr, newVal);
        }
        newLowestAddress = _nextAddresses[GUARD];
        newLowestValue = _values[newLowestAddress];
    }

    /**
     * @notice remove an address
     * @param addr address to remove
     * Revert if address doesn't exist
     * Returns the new lowest address and value
     */
    function remove(
        address addr
    )
        external
        addressExist(addr)
        returns (address newLowestAddress, uint256 newLowestValue)
    {
        _remove(addr);
        unchecked {
            --size;
        }
        newLowestAddress = _nextAddresses[GUARD];
        newLowestValue = _values[newLowestAddress];
    }

    function _insert(address addr, uint256 value) internal {
        (address _prev, address _next) = _findIndex(value);

        _nextAddresses[addr] = _next;
        _nextAddresses[_prev] = addr;

        _prevAddresses[_next] = addr;
        _prevAddresses[addr] = _prev;

        _values[addr] = value;
    }

    function _remove(address addr) internal {
        (address _prev, address _next) = (
            _prevAddresses[addr],
            _nextAddresses[addr]
        );
        _nextAddresses[_prev] = _next;
        _prevAddresses[_next] = _prev;

        delete _prevAddresses[addr];
        delete _nextAddresses[addr];
        delete _values[addr];
    }

    function _verifyIndex(
        address prev,
        uint256 value,
        address next
    ) internal view returns (bool) {
        return
            (prev == GUARD || _values[prev] < value) &&
            (next == GUARD || _values[next] > value);
    }

    function _findIndex(
        uint256 newValue
    ) internal view returns (address prev, address next) {
        prev = GUARD;
        next = _nextAddresses[GUARD];
        while (true) {
            if (_verifyIndex(prev, newValue, next)) {
                break;
            }
            prev = next;
            next = _nextAddresses[next];
        }
    }
}
